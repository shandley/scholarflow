import type { Publication } from '@/types/profile'

interface PublicationListProps {
  publications: Publication[]
  showAll?: boolean
  detailed?: boolean
  compact?: boolean
  theme?: 'light' | 'dark'
}

export default function PublicationList({ 
  publications, 
  showAll = false, 
  detailed = false, 
  compact = false,
  theme = 'light'
}: PublicationListProps) {
  const displayedPublications = showAll ? publications : publications.slice(0, 5)
  
  const baseClasses = theme === 'dark' 
    ? 'bg-gray-800 text-white' 
    : 'bg-white'
  
  const textClasses = theme === 'dark'
    ? { primary: 'text-white', secondary: 'text-gray-300', muted: 'text-gray-400' }
    : { primary: 'text-charcoal', secondary: 'text-gray-700', muted: 'text-gray-500' }

  return (
    <div className={`space-y-${compact ? '3' : '4'}`}>
      {displayedPublications.map((publication) => (
        <div key={publication.id} className={`card ${baseClasses}`}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-semibold ${textClasses.primary} leading-tight`}>
                {publication.url ? (
                  <a 
                    href={publication.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-sage-green transition-colors"
                  >
                    {publication.title}
                  </a>
                ) : (
                  publication.title
                )}
              </h3>
              
              <div className={`${compact ? 'text-xs' : 'text-sm'} ${textClasses.secondary} mt-1`}>
                {publication.authors.length > 0 && (
                  <span>
                    {publication.authors.slice(0, 3).join(', ')}
                    {publication.authors.length > 3 && ' et al.'}
                  </span>
                )}
              </div>
              
              <div className={`${compact ? 'text-xs' : 'text-sm'} ${textClasses.muted} mt-1`}>
                {publication.journal && (
                  <span className="font-medium">
                    {publication.journal}
                  </span>
                )}
                {publication.journal && publication.year && ' • '}
                <span>{publication.year}</span>
                {publication.type && (
                  <>
                    {' • '}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      publication.type === 'journal-article' ? 'bg-green-100 text-green-800' :
                      publication.type === 'conference-paper' ? 'bg-blue-100 text-blue-800' :
                      publication.type === 'book' ? 'bg-purple-100 text-purple-800' :
                      publication.type === 'preprint' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {publication.type.replace('-', ' ')}
                    </span>
                  </>
                )}
              </div>

              {detailed && publication.abstract && (
                <p className={`${compact ? 'text-xs' : 'text-sm'} ${textClasses.secondary} mt-3 leading-relaxed`}>
                  {publication.abstract.length > 200 
                    ? `${publication.abstract.substring(0, 200)}...` 
                    : publication.abstract
                  }
                </p>
              )}

              {publication.keywords && publication.keywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {publication.keywords.slice(0, 5).map((keyword, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-sage-green bg-opacity-20 text-sage-green"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-right flex-shrink-0">
              {publication.citationCount !== undefined && (
                <div className={`${compact ? 'text-xs' : 'text-sm'} ${textClasses.muted}`}>
                  <div className="font-medium">{publication.citationCount}</div>
                  <div className="text-xs">citations</div>
                </div>
              )}
              
              <div className="mt-2 space-y-1">
                {publication.doi && (
                  <a 
                    href={`https://doi.org/${publication.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-sage-green hover:underline"
                  >
                    DOI
                  </a>
                )}
                
                {publication.url && (
                  <a 
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-sage-green hover:underline"
                  >
                    View
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {!showAll && publications.length > 5 && (
        <div className="text-center pt-4">
          <button className="text-sage-green hover:underline font-medium">
            View all {publications.length} publications →
          </button>
        </div>
      )}
    </div>
  )
}