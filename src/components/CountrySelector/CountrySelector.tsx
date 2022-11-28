import './CountrySelector.style.scss';

import React, { useMemo, useState } from 'react';

import { defaultCountries } from '../../data/countryData';
import { buildClassNames } from '../../style/buildClassNames';
import { CountryData, CountryIso2 } from '../../types';
import { getCountry } from '../../utils';
import { FlagEmoji } from '../FlagEmoji/FlagEmoji';
import {
  CountrySelectorDropdown,
  CountrySelectorDropdownProps,
  CountrySelectorDropdownStyleProps,
} from './CountrySelectorDropdown';

export interface CountrySelectorStyleProps {
  style?: React.CSSProperties;
  className?: string;

  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;

  flagStyle?: React.CSSProperties;
  flagClassName?: string;

  dropdownArrowStyle?: React.CSSProperties;
  dropdownArrowClassName?: string;

  dropdownStyleProps?: CountrySelectorDropdownStyleProps;
}

export interface CountrySelectorProps extends CountrySelectorStyleProps {
  selectedCountry?: CountryIso2;
  onSelect?: CountrySelectorDropdownProps['onSelect'];
  disabled?: boolean;
  hideDropdown?: boolean;
  countries?: CountryData[];
  renderButtonWrapper?: (props: {
    children: React.ReactNode;
    onClick: () => void;
  }) => React.ReactNode;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onSelect,
  disabled,
  hideDropdown,
  countries = defaultCountries,
  renderButtonWrapper,
  ...styleProps
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const fullSelectedCountry = useMemo(() => {
    if (!selectedCountry) return undefined;
    return getCountry({
      value: selectedCountry,
      field: 'iso2',
      countries: countries,
    });
  }, [countries, selectedCountry]);

  const renderSelectorButton = () => {
    const onClick = () => setShowDropdown(true);

    const buttonContent = (
      <>
        <FlagEmoji
          iso2={selectedCountry}
          className={buildClassNames({
            addPrefix: [
              'country-selector-button__flag-emoji',
              disabled && 'country-selector-button__flag-emoji--disabled',
            ],
            rawClassNames: [styleProps.flagClassName],
          })}
          style={{
            visibility: selectedCountry ? 'visible' : 'hidden',
            ...styleProps.flagStyle,
          }}
        />
        {!hideDropdown && (
          <div
            className={buildClassNames({
              addPrefix: [
                'country-selector-button__dropdown-arrow',
                disabled && 'country-selector-button__dropdown-arrow--disabled',
                showDropdown &&
                  'country-selector-button__dropdown-arrow--active',
              ],
              rawClassNames: [styleProps.dropdownArrowClassName],
            })}
            style={styleProps.dropdownArrowStyle}
          />
        )}
      </>
    );
    if (renderButtonWrapper) {
      return renderButtonWrapper({ children: buttonContent, onClick });
    }
    return (
      <button
        title={fullSelectedCountry?.name}
        onClick={onClick}
        className={buildClassNames({
          addPrefix: [
            'country-selector-button',
            showDropdown && 'country-selector-button--active',
            disabled && 'country-selector-button--disabled',
            hideDropdown && 'country-selector-button--hide-dropdown',
          ],
          rawClassNames: [styleProps.buttonClassName],
        })}
        disabled={hideDropdown || disabled}
        aria-haspopup="listbox"
        aria-expanded={hideDropdown}
        data-country={selectedCountry}
        style={styleProps.buttonStyle}
      >
        {buttonContent}
      </button>
    );
  };

  return (
    <div
      className={buildClassNames({
        addPrefix: ['country-selector'],
        rawClassNames: [styleProps.className],
      })}
      style={styleProps.style}
    >
      {renderSelectorButton()}
      <CountrySelectorDropdown
        show={showDropdown}
        countries={countries}
        onSelect={(country) => {
          setShowDropdown(false);
          onSelect?.(country);
        }}
        selectedCountry={selectedCountry}
        onClickOutside={() => {
          setShowDropdown(false);
        }}
        onEscapePress={() => {
          setShowDropdown(false);
        }}
        {...styleProps.dropdownStyleProps}
      />
    </div>
  );
};
