import React from 'react';
import { DropZone } from '@adminjs/design-system';

const DropZoneUpload = (props) => {
  const { property, onChange } = props;  // No need for record since this is for new/edit

  const handleDrop = (files) => {
    // Pass the array of files to AdminJS's onChange
    onChange(property.name, files);
  };

  return (
    <DropZone
      onChange={handleDrop}
      multiple={true}  // For multi-file
      name={property.name}  // Ensures files are sent with fieldname 'images_upload'
    />
  );
};

export default DropZoneUpload;