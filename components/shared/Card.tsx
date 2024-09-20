import { IEvent } from '@/lib/database/models/event.model'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DeleteConfirmation } from './DeleteConfirmation'
import { CalendarIcon, MapPinIcon, TicketIcon, User } from 'lucide-react'
import VerifiedBadge from '../ui/verified'

type CardProps = {
  event: IEvent,
  hasOrderLink?: boolean,
  hidePrice?: boolean
}

const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const isEventCreator = userId === event.organizer._id.toString();

  return (
<div className="group relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-gray-800 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
<Link 
        href={`/events/${event._id}`}
        className="relative aspect-[4/3] w-full overflow-hidden"
      >
        <Image 
          src={event.imageUrl} 
          alt={event.title} 
          layout="fill" 
          objectFit="cover"
          className="transition-transform duration-300 transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-80 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-2xl font-bold text-white line-clamp-2">{event.title}</h3>
        </div>
      </Link>

      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-gray-800/80 backdrop-blur-sm p-3 shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>

          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      <div className="flex flex-col gap-3 p-5 md:gap-4 flex-grow">
        {!hidePrice && (
          <div className="flex items-center gap-2">
            <span className="px-4 py-1 text-md font-regular rounded-full bg-green-900 text-green-300">
              {event.isFree ? 'FREE' : `₹${event.price}`}
            </span>
            <span className="px-4 py-1 text-md font-regular rounded-full bg-gray-700 text-gray-300">
              {event.category.name}
            </span>
          </div>
        )}

        <div className="flex items-center text-gray-400 text-sm">
          <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <p>{formatDateTime(event.startDateTime).dateTime}</p>
        </div>

        <div className="flex items-start text-gray-400 text-md">
          <User className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
          <p className="break-words">
            {event.organizer.firstName} {event.organizer.lastName} 
          </p>
          
        </div>

        {hasOrderLink && (
          <Link 
            href={`/orders?eventId=${event._id}`} 
            className="mt-auto flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-blue-400 bg-blue-900/30 rounded-lg hover:bg-blue-900/50 transition-colors"
          >
            <TicketIcon className="w-5 h-5" />
            <span>View Order Details</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Card