'use client'
import { useUser } from '@/hooks/queries/use-user'
import React, { useState, useEffect, ReactNode } from 'react'
import dayjs from 'dayjs'
import { ChallengePlanPopup } from './ChallengePlanPopup'
import { ExpiredPlanPopup } from './ExpiredPlanPopup'
import { RefundedPlanPopup } from './RefundedPlanPopup'

export const UpgradeModalTrigger = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsopen] = useState(false)
  const { data: user } = useUser()
  dayjs.locale('pt-br')
  // usecase#1: verificação para o usuário desafio
  useEffect(() => {
    if (!user) return
    const userPlan = user.plan?.toLowerCase()
    const actualDate = dayjs()
    const purchaseDate = dayjs(user.data_de_compra)
    const afterSevenDays = purchaseDate.add(7, 'day')

    if (userPlan === 'desafio' && actualDate.isAfter(afterSevenDays)) {
      setIsopen(true)
    }
  }, [user])
  // verificacao para o usuário expirado
  useEffect(() => {
    if (!user) return
    const userPlan = user.plan?.toLowerCase()
    const actualDate = dayjs()
    const renovationDate = dayjs(user.data_de_renovacao)
    const afterSevenDays = renovationDate.add(7, 'day')
    if (
      (userPlan === 'mensal' && actualDate.isAfter(afterSevenDays)) ||
      (userPlan === 'anual' && actualDate.isAfter(afterSevenDays))
    ) {
      setIsopen(true)
    } else if (userPlan === 'trial' && actualDate.isAfter(renovationDate)) {
      setIsopen(true)
    }
  }, [user])
  // verificação para o usuário reembolso
  return (
    <>
      {children}
      {isOpen && <ChallengePlanPopup open={isOpen} setOpen={setIsopen} />}
      {isOpen && user?.status_plan === 'EXPIRADO' && (
        <ExpiredPlanPopup open={isOpen} setOpen={setIsopen} />
      )}
      {isOpen && user?.status_plan === 'REEMBOLSO' && (
        <RefundedPlanPopup open={isOpen} setOpen={setIsopen} />
      )}
    </>
  )
}
