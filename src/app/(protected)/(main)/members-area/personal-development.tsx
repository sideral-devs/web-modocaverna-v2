import { CourseSwiper, CourseSwiperData } from '@/components/course-swiper'
import { Skeleton } from '@/components/ui/skeleton'

export default function PersonalDevelopment({
  courses,
}: {
  courses: CourseSwiperData[] | null | undefined
}) {
  if (!courses) {
    return (
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((i, index) => (
          <Skeleton
            key={index}
            className="w-60 xl:w-[calc(30vw-80px)] max-w-80 aspect-[2/3]"
          />
        ))}
      </div>
    )
  }

  return <CourseSwiper data={courses} />
}
