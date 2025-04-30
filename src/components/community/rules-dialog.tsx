'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function RulesDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (arg: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl max-h-[95%]">
        <DialogHeader>
          <DialogTitle>📌 REGRAS DE USO</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-6 py-4 gap-6">
          <p className="text-sm">
            🛡️ A Alcateia não admite bagunça. Aqui dentro, seguimos um Código de
            Honra que mantém nossa força e nosso propósito.
          </p>
          <ol className="flex flex-col gap-4 text-sm text-zinc-300 font-normal">
            <li className="flex">
              <span>1.</span>
              <div className="pl-2">
                <p>
                  <strong className="text-white">
                    Respeito é inegociável:
                  </strong>{' '}
                  🤝 Ataques pessoais, discurso de ódio, intolerância religiosa,
                  racismo ou qualquer forma de preconceito não têm espaço na
                  Caverna.
                </p>
              </div>
            </li>
            <li className="flex">
              <span>2.</span>
              <div className="pl-2">
                <p>
                  <strong className="text-white">
                    Protegemos a mente e o espírito:
                  </strong>{' '}
                  🧠🔥 Conteúdos pornográficos, explícitos ou de mau gosto serão
                  removidos sem aviso.
                </p>
              </div>
            </li>
            <li className="flex">
              <span>3.</span>
              <div className="pl-2">
                <p>
                  <strong className="text-white">
                    Sem poluição na trilha:
                  </strong>{' '}
                  🚫🌪️ Flood, spam, mensagens repetitivas ou irrelevantes
                  quebram o foco da Alcateia — evite.
                </p>
              </div>
            </li>
            <li className="flex">
              <span>4.</span>
              <div className="pl-2">
                <p>
                  <strong className="text-white">
                    Propaganda só com propósito:
                  </strong>{' '}
                  📢⚡ Venda de produtos ou divulgação de serviços é proibida,
                  salvo autorização expressa da liderança.
                </p>
              </div>
            </li>
            <li className="flex">
              <span>5.</span>
              <div className="pl-2">
                <p>
                  <strong className="text-white">
                    Discussões elevam, não destroem:
                  </strong>{' '}
                  🗣️🛡️ Discordar faz parte, mas aqui debatemos ideias — não
                  atacamos pessoas.
                </p>
              </div>
            </li>
            <li className="flex">
              <span>6.</span>
              <div className="pl-2">
                <p>
                  <strong className="text-white">
                    Cada lobo zela pela clareza:
                  </strong>{' '}
                  🧹📋 Publique nas abas corretas, use títulos claros e ajude a
                  manter a ordem.
                </p>
              </div>
            </li>
            <li className="flex">
              <span>7.</span>
              <div className="pl-2">
                <p>
                  <strong className="text-white">
                    Segurança acima de tudo:
                  </strong>{' '}
                  🔒🐾 Não compartilhe dados pessoais sensíveis seus ou de
                  outros membros.
                </p>
              </div>
            </li>
            <li className="flex">
              <span>8.</span>
              <div className="pl-2">
                <p>
                  <strong className="text-white">
                    Sobre problemas e melhorias:
                  </strong>{' '}
                  🛠️💬 Erros no sistema e falhas técnicas devem ser reportados
                  diretamente ao Capitão Caverna no suporte. Aqui é espaço para
                  trocas de uso, ideias de evolução e conexões entre lobos.
                </p>
              </div>
            </li>
            <li className="flex">
              <span>9.</span>
              <div className="pl-2">
                <p>
                  <strong className="text-white">
                    O Capitão vigia as trilhas:
                  </strong>{' '}
                  👁️‍🗨️🐺 Quem quebrar as regras poderá ser silenciado ou removido
                  da Caverna sem aviso prévio.
                </p>
              </div>
            </li>
            <li className="flex">
              <span>10.</span>
              <div className="pl-2">
                <p>
                  <strong className="text-white">Honre a Alcateia:</strong> 🐺❤️
                  Valorize o espaço, fortaleça seus irmãos e honre o esforço
                  coletivo. Cada atitude sua molda a força que nos guia.
                </p>
              </div>
            </li>
          </ol>
          <div className="w-full flex flex-col px-4 py-6 gap-4 bg-gradient-to-r from-[#191919] to-[#212121] border-b-4 border-primary">
            <p className="text-sm">
              Aqui, cada passo conta. Cada voz importa. Cada atitude fortalece
              ou enfraquece a Alcateia. Escolha ser parte da construção. 🔺🐺
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
