'use client'
import { CardsCarousel } from '@/components/ui/cards-carousel'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

function CourseCard({
  src,
  title,
  description,
  index,
  href,
  layout = false,
  lessons,
  hours,
  disabled = false,
}: {
  src: string
  title: string
  description: string
  href: string
  index: number
  lessons: number
  hours: number
  layout?: boolean
  disabled?: boolean
}) {
  function Content() {
    return (
      <motion.div
        layoutId={layout ? `card-${title}` : undefined}
        className={cn(
          'rounded-xl bg-neutral-900 w-60 xl:w-[calc(30vw-80px)] max-w-80 aspect-[2/3] overflow-hidden flex flex-col items-start justify-start relative z-10 group border border-transparent hover:border-border transition-all duration-700',
          disabled ? 'cursor-not-allowed' : '',
        )}
      >
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-transparent via-black/75 to-black z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="flex flex-col absolute z-40 p-7 gap-5 bottom-0 opacity-0 group-hover:opacity-100 translate-y-[50%] group-hover:translate-y-0 transition-all duration-700">
          <motion.p
            layoutId={layout ? `title-${title}` : undefined}
            className="text-2xl md:text-3xl font-semibold max-w-xs text-left [text-wrap:balance] font-sans mt-2"
          >
            {title}
          </motion.p>
          <motion.p
            layoutId={
              layout ? `description-${index}-${description}` : undefined
            }
            className="text-zinc-500 text-sm line-clamp-2"
          >
            {description}
          </motion.p>
          {disabled ? (
            <span className="text-sm font-italic">Em Breve</span>
          ) : (
            <span className="text-sm">
              {lessons} aulas • {hours} horas
            </span>
          )}
        </div>
        <BlurImage
          src={src}
          alt={title}
          fill
          className="object-cover absolute z-10 inset-0"
        />
      </motion.div>
    )
  }

  return disabled ? (
    <Content />
  ) : (
    <Link href={href} draggable={false}>
      <Content />
    </Link>
  )
}

function BlurImage({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) {
  const [isLoading, setLoading] = useState(true)
  return (
    <Image
      className={cn(
        'transition duration-300',
        isLoading ? 'blur-sm' : 'blur-0',
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      draggable={false}
      blurDataURL={typeof src === 'string' ? src : undefined}
      alt={alt || 'Módulo do curso'}
      sizes="calc(25vw-80px)"
      {...rest}
    />
  )
}

export type CourseSwiperData = {
  src: string
  title: string
  description: string
  href: string
  lessons: number
  hours: number
  disabled?: boolean
  category?: string
}

export function CourseSwiper({ data }: { data: CourseSwiperData[] }) {
  return (
    <CardsCarousel
      items={data.map((card, index) => (
        <CourseCard
          key={card.src}
          src={card.src}
          title={card.title}
          description={card.description}
          index={index}
          href={card.href}
          lessons={card.lessons}
          hours={card.hours}
          disabled={card.disabled}
          layout
        />
      ))}
    />
  )
}
