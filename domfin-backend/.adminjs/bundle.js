(function (React, designSystem) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  // domfin-backend/src/components/DropZoneUpload.jsx
  const DropZoneUpload = props => {
    const {
      property,
      onChange
    } = props; // No need for record since this is for new/edit

    const handleDrop = files => {
      // Pass the array of files to AdminJS's onChange
      onChange(property.name, files);
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.DropZone, {
      onChange: handleDrop,
      multiple: true // For multi-file
      ,
      name: property.name // Ensures files are sent with fieldname 'images_upload'
    });
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.DropZoneUpload = DropZoneUpload;

})(React, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50cy9Ecm9wWm9uZVVwbG9hZC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBkb21maW4tYmFja2VuZC9zcmMvY29tcG9uZW50cy9Ecm9wWm9uZVVwbG9hZC5qc3hcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgRHJvcFpvbmUgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcclxuXHJcbmNvbnN0IERyb3Bab25lVXBsb2FkID0gKHByb3BzKSA9PiB7XHJcbiAgY29uc3QgeyBwcm9wZXJ0eSwgb25DaGFuZ2UgfSA9IHByb3BzOyAgLy8gTm8gbmVlZCBmb3IgcmVjb3JkIHNpbmNlIHRoaXMgaXMgZm9yIG5ldy9lZGl0XHJcblxyXG4gIGNvbnN0IGhhbmRsZURyb3AgPSAoZmlsZXMpID0+IHtcclxuICAgIC8vIFBhc3MgdGhlIGFycmF5IG9mIGZpbGVzIHRvIEFkbWluSlMncyBvbkNoYW5nZVxyXG4gICAgb25DaGFuZ2UocHJvcGVydHkubmFtZSwgZmlsZXMpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8RHJvcFpvbmVcclxuICAgICAgb25DaGFuZ2U9e2hhbmRsZURyb3B9XHJcbiAgICAgIG11bHRpcGxlPXt0cnVlfSAgLy8gRm9yIG11bHRpLWZpbGVcclxuICAgICAgbmFtZT17cHJvcGVydHkubmFtZX0gIC8vIEVuc3VyZXMgZmlsZXMgYXJlIHNlbnQgd2l0aCBmaWVsZG5hbWUgJ2ltYWdlc191cGxvYWQnXHJcbiAgICAvPlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEcm9wWm9uZVVwbG9hZDsiLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEcm9wWm9uZVVwbG9hZCBmcm9tICcuLi9zcmMvY29tcG9uZW50cy9Ecm9wWm9uZVVwbG9hZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRHJvcFpvbmVVcGxvYWQgPSBEcm9wWm9uZVVwbG9hZCJdLCJuYW1lcyI6WyJEcm9wWm9uZVVwbG9hZCIsInByb3BzIiwicHJvcGVydHkiLCJvbkNoYW5nZSIsImhhbmRsZURyb3AiLCJmaWxlcyIsIm5hbWUiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJEcm9wWm9uZSIsIm11bHRpcGxlIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBQUE7RUFJQSxNQUFNQSxjQUFjLEdBQUlDLEtBQUssSUFBSztJQUNoQyxNQUFNO01BQUVDLFFBQVE7RUFBRUMsSUFBQUE7S0FBVSxHQUFHRixLQUFLLENBQUM7O0lBRXJDLE1BQU1HLFVBQVUsR0FBSUMsS0FBSyxJQUFLO0VBQzVCO0VBQ0FGLElBQUFBLFFBQVEsQ0FBQ0QsUUFBUSxDQUFDSSxJQUFJLEVBQUVELEtBQUssQ0FBQztJQUNoQyxDQUFDO0VBRUQsRUFBQSxvQkFDRUUsc0JBQUEsQ0FBQUMsYUFBQSxDQUFDQyxxQkFBUSxFQUFBO0VBQ1BOLElBQUFBLFFBQVEsRUFBRUMsVUFBVztNQUNyQk0sUUFBUSxFQUFFLElBQUs7RUFBRTtFQUNqQkosSUFBQUEsSUFBSSxFQUFFSixRQUFRLENBQUNJLElBQUs7RUFBRSxHQUN2QixDQUFDO0VBRU4sQ0FBQzs7RUNuQkRLLE9BQU8sQ0FBQ0MsY0FBYyxHQUFHLEVBQUU7RUFFM0JELE9BQU8sQ0FBQ0MsY0FBYyxDQUFDWixjQUFjLEdBQUdBLGNBQWM7Ozs7OzsifQ==
