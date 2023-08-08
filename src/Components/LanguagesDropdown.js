import React from 'react';
import Select from 'react-select';
import "./Dropdown.scss";
import languageOptions from "../Constants/languagesOptions";


const LanguagesDropdown = ({ onSelectChange}) => {
  return (
   <Select
    placeholder={`Filter by Category`}
    defaultValue={languageOptions[0]}
    options={languageOptions}
    onChange={(selectedOption) => onSelectChange(selectedOption)}
   />
  );
};

export default LanguagesDropdown;