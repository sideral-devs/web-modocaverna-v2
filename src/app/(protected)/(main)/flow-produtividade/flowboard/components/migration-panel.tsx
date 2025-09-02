'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Download, 
  Upload, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  Trash2
} from 'lucide-react'
import { 
  FlowBoardDataMigration, 
  MigrationProgressTracker, 
  MigrationStatus, 
  ExportData,
  ImportData
} from '../utils/data-migration'
import { FlowBoardService } from '../types/flowboard.types'

interface MigrationPanelProps {
  userId: string
  localStorageService: FlowBoardService
  apiService?: FlowBoardService
  onMigrationComplete?: () => void
}

export const MigrationPanel: React.FC<MigrationPanelProps> = ({
  userId,
  localStorageService,
  apiService,
  onMigrationComplete
}) => {
  const [exportData, setExportData] = useState<ExportData | null>(null)
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    status: 'idle',
    progress: 0,
    totalBoards: 0,
    migratedBoards: 0,
    failedBoards: 0,
    errors: []
  })
  const [isExporting, setIsExporting] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)

  // Export localStorage data
  const handleExportData = useCallback(async () => {
    setIsExporting(true)
    try {
      const data = FlowBoardDataMigration.exportLocalStorageData(userId)
      setExportData(data)
      
      // Automatically download the export file
      FlowBoardDataMigration.downloadExportData(data)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }, [userId])

  // Import data from file
  const handleImportData = useCallback(async (file: File) => {
    try {
      const importData = await FlowBoardDataMigration.parseExportFile(file)
      setExportData({
        version: importData.version,
        exportedAt: typeof importData.exportedAt === 'string' 
          ? new Date(importData.exportedAt) 
          : importData.exportedAt,
        userId: importData.userId,
        boards: importData.boards as any[],
        metadata: {
          totalBoards: importData.metadata?.totalBoards || importData.boards.length,
          totalSize: importData.metadata?.totalSize || JSON.stringify(importData.boards).length,
          exportFormat: 'json' as const
        }
      })
    } catch (error) {
      console.error('Import failed:', error)
      alert('Failed to import data. Please check the file format.')
    }
  }, [])

  // Migrate data to API
  const handleMigrateToAPI = useCallback(async () => {
    if (!exportData || !apiService) return

    setIsMigrating(true)
    const tracker = new MigrationProgressTracker()
    
    // Listen to migration progress
    const unsubscribe = tracker.onStatusChange(setMigrationStatus)

    try {
      tracker.start(exportData.boards.length)

      for (const board of exportData.boards) {
        try {
          // Transform board data for API
          const apiBoard = FlowBoardDataMigration.transformBoardForAPI(board)
          
          // Create board via API
          const createdBoard = await apiService.createBoard(apiBoard.name!)
          
          // Update board content if it has any
          if (apiBoard.content && (
            apiBoard.content.nodes.length > 0 || 
            apiBoard.content.edges.length > 0
          )) {
            await apiService.saveBoardContent(createdBoard.id, apiBoard.content)
          }

          tracker.boardMigrated()
        } catch (error) {
          console.error(`Failed to migrate board ${board.name}:`, error)
          tracker.boardFailed(
            board.id, 
            board.name, 
            error instanceof Error ? error.message : 'Unknown error'
          )
        }
      }

      tracker.complete()
      
      // Clean up localStorage after successful migration
      if (tracker.getStatus().migratedBoards > 0) {
        FlowBoardDataMigration.cleanupLocalStorage(userId)
        onMigrationComplete?.()
      }

    } catch (error) {
      console.error('Migration failed:', error)
      tracker.fail()
    } finally {
      setIsMigrating(false)
      unsubscribe()
    }
  }, [exportData, apiService, userId, onMigrationComplete])

  // File input handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImportData(file)
    }
  }, [handleImportData])

  // Get status color and icon
  const getStatusDisplay = (status: MigrationStatus['status']) => {
    switch (status) {
      case 'idle':
        return { color: 'default', icon: Clock, text: 'Ready' }
      case 'in_progress':
        return { color: 'yellow', icon: Clock, text: 'In Progress' }
      case 'completed':
        return { color: 'green', icon: CheckCircle, text: 'Completed' }
      case 'failed':
        return { color: 'red', icon: XCircle, text: 'Failed' }
      default:
        return { color: 'default', icon: Clock, text: 'Unknown' }
    }
  }

  const statusDisplay = getStatusDisplay(migrationStatus.status)
  const StatusIcon = statusDisplay.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Phase 2 Migration Tools
          </CardTitle>
          <CardDescription>
            Export your FlowBoard data from localStorage and migrate to the backend API
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </CardTitle>
          <CardDescription>
            Export your current FlowBoard data from localStorage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? 'Exporting...' : 'Export localStorage Data'}
          </Button>

          {exportData && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Export completed!</strong></p>
                  <div className="text-sm space-y-1">
                    <p>• Total boards: {exportData.metadata.totalBoards}</p>
                    <p>• Data size: {Math.round(exportData.metadata.totalSize / 1024)} KB</p>
                    <p>• Exported at: {exportData.exportedAt.toLocaleString()}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import Data
          </CardTitle>
          <CardDescription>
            Import FlowBoard data from an export file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500">
              Select a FlowBoard export JSON file to import
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Migration Section */}
      {exportData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Migrate to API
            </CardTitle>
            <CardDescription>
              Migrate your exported data to the backend API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Migration Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={statusDisplay.color as any}>
                  {statusDisplay.text}
                </Badge>
              </div>
              {migrationStatus.status === 'in_progress' && (
                <span className="text-sm text-gray-500">
                  {migrationStatus.progress}%
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {migrationStatus.status === 'in_progress' && (
              <Progress value={migrationStatus.progress} className="w-full" />
            )}

            {/* Migration Details */}
            {migrationStatus.totalBoards > 0 && (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">
                    {migrationStatus.totalBoards}
                  </div>
                  <div className="text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">
                    {migrationStatus.migratedBoards}
                  </div>
                  <div className="text-gray-500">Migrated</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600">
                    {migrationStatus.failedBoards}
                  </div>
                  <div className="text-gray-500">Failed</div>
                </div>
              </div>
            )}

            {/* Migration Errors */}
            {migrationStatus.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Migration Errors:</strong></p>
                    <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
                      {migrationStatus.errors.map((error, index) => (
                        <p key={index}>
                          • <strong>{error.boardName}:</strong> {error.error}
                        </p>
                      ))}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Migration Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={handleMigrateToAPI}
                disabled={isMigrating || !apiService || migrationStatus.status === 'completed'}
                className="flex-1"
              >
                {isMigrating ? 'Migrating...' : 'Start Migration'}
              </Button>
              
              {migrationStatus.status === 'completed' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const report = FlowBoardDataMigration.generateMigrationReport(
                      exportData,
                      migrationStatus
                    )
                    const blob = new Blob([report], { type: 'text/markdown' })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `migration-report-${Date.now()}.md`
                    link.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              )}
            </div>

            {/* Cleanup Warning */}
            {migrationStatus.status === 'completed' && migrationStatus.migratedBoards > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Migration completed successfully!</strong></p>
                    <p className="text-sm">
                      Your data has been migrated to the backend API. 
                      The localStorage data has been automatically cleaned up.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Board Preview */}
      {exportData && exportData.boards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Data Preview
            </CardTitle>
            <CardDescription>
              Preview of boards to be migrated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {exportData.boards.map((board, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{board.name}</div>
                    <div className="text-sm text-gray-500">
                      {board.content.nodes.length} nodes, {board.content.edges.length} edges
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(board.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 min-w-[20px]">1.</span>
              <span>Click "Export localStorage Data" to create a backup of your current boards</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 min-w-[20px]">2.</span>
              <span>The export file will be automatically downloaded to your computer</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 min-w-[20px]">3.</span>
              <span>Click "Start Migration" to transfer your data to the backend API</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 min-w-[20px]">4.</span>
              <span>Monitor the progress and check for any errors during migration</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600 min-w-[20px]">5.</span>
              <span>Once completed, your localStorage data will be automatically cleaned up</span>
            </div>
          </div>

          <Separator />

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Keep your export file as a backup. 
              The migration process will permanently remove data from localStorage after successful migration.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export default MigrationPanel