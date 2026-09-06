import React, { forwardRef, memo } from 'react';
import Badge from '../ui/Badge';
import formatCurrency from '../../utils/budgetCalculator';

export const DestinationCard = memo(
  forwardRef(function DestinationCard(
    {
      destination,
      onClick,
      onToggleFavorite,
      onViewDetails,
      isFavorite = false,
      isSelected = false,
      className = '',
    },
    ref
  ) {
    if (!destination) return null;

    const { name, description, vibe, image, budgetPerDay } = destination;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        onClick?.(e);
      }
    };

    const handleSaveClick = (e) => {
      e.stopPropagation();
      onToggleFavorite?.(destination.id);
    };

    const handleDetailsClick = (e) => {
      e.stopPropagation();
      onViewDetails?.(destination);
    };

    return (
      <article
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-pressed={isSelected}
        className={`group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
        } ${className}`.trim()}
      >
        <img
          src={image}
          alt={`${name} - ${vibe} destination`}
          loading="lazy"
          className="w-full aspect-video object-cover rounded-t-xl"
        />
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
            {vibe && (
              <Badge variant={vibe.toLowerCase()}>{vibe}</Badge>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-primary font-bold">
              {formatCurrency(budgetPerDay)}/day
            </span>
            <span
              className="text-gray-400 group-hover:text-primary transition-colors text-base font-semibold"
              aria-hidden="true"
            >
              →
            </span>
          </div>

          {(onToggleFavorite || onViewDetails) && (
            <div className="mt-4 flex items-center gap-2">
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={handleSaveClick}
                  aria-label={isFavorite ? `Saved ${name}` : `Save ${name}`}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isFavorite
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
              )}
              {onViewDetails && (
                <button
                  type="button"
                  onClick={handleDetailsClick}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Details
                </button>
              )}
            </div>
          )}
        </div>
      </article>
    );
  })
);

DestinationCard.displayName = 'DestinationCard';

export default DestinationCard;
