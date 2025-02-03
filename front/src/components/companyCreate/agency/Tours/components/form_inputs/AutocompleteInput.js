import React, { useState, useRef, useEffect } from 'react';

const AutocompleteInput = ({ 
  id, 
  value, 
  onChange, 
  options, 
  placeholder,
  icon 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Input değeri değiştiğinde search term'i güncelle
    const option = options.find(opt => opt.value === value);
    setSearchTerm(option ? option.label : '');
    setSelectedOption(option || null);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Eğer geçerli bir seçim yoksa, input'u temizle
        if (!selectedOption) {
          setSearchTerm('');
          onChange({
            target: {
              name: id,
              value: ''
            }
          });
        } else {
          // Seçili değeri geri yükle
          setSearchTerm(selectedOption.label);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption, onChange, id]);

  useEffect(() => {
    // Arama terimini kullanarak seçenekleri filtrele
    const filtered = options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    setSelectedOption(null);
  };

  const handleOptionSelect = (option) => {
    setSearchTerm(option.label);
    setSelectedOption(option);
    setIsOpen(false);
    
    onChange({
      target: {
        name: id,
        value: option.value
      }
    });
  };

  return (
    <div className="position-relative" ref={wrapperRef}>
      <div className="input-group">
        {icon && (
          <span className="input-group-text">
            <i className={`bi ${icon}`}></i>
          </span>
        )}
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="position-absolute w-100 mt-1 shadow bg-white rounded border" 
             style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="px-3 py-2 cursor-pointer hover-bg-light"
              onClick={() => handleOptionSelect(option)}
              style={{ cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput; 