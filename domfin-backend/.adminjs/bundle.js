(function (React, designSystem) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50cy9Ecm9wWm9uZVVwbG9hZC5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBEcm9wWm9uZSB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xyXG5cclxuY29uc3QgRHJvcFpvbmVVcGxvYWQgPSAocHJvcHMpID0+IHtcclxuICBjb25zdCB7IHByb3BlcnR5LCBvbkNoYW5nZSB9ID0gcHJvcHM7ICAvLyBObyBuZWVkIGZvciByZWNvcmQgc2luY2UgdGhpcyBpcyBmb3IgbmV3L2VkaXRcclxuXHJcbiAgY29uc3QgaGFuZGxlRHJvcCA9IChmaWxlcykgPT4ge1xyXG4gICAgLy8gUGFzcyB0aGUgYXJyYXkgb2YgZmlsZXMgdG8gQWRtaW5KUydzIG9uQ2hhbmdlXHJcbiAgICBvbkNoYW5nZShwcm9wZXJ0eS5uYW1lLCBmaWxlcyk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxEcm9wWm9uZVxyXG4gICAgICBvbkNoYW5nZT17aGFuZGxlRHJvcH1cclxuICAgICAgbXVsdGlwbGU9e3RydWV9ICAvLyBGb3IgbXVsdGktZmlsZVxyXG4gICAgICBuYW1lPXtwcm9wZXJ0eS5uYW1lfSAgLy8gRW5zdXJlcyBmaWxlcyBhcmUgc2VudCB3aXRoIGZpZWxkbmFtZSAnaW1hZ2VzX3VwbG9hZCdcclxuICAgIC8+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERyb3Bab25lVXBsb2FkOyIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERyb3Bab25lVXBsb2FkIGZyb20gJy4uL3NyYy9jb21wb25lbnRzL0Ryb3Bab25lVXBsb2FkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Ecm9wWm9uZVVwbG9hZCA9IERyb3Bab25lVXBsb2FkIl0sIm5hbWVzIjpbIkRyb3Bab25lVXBsb2FkIiwicHJvcHMiLCJwcm9wZXJ0eSIsIm9uQ2hhbmdlIiwiaGFuZGxlRHJvcCIsImZpbGVzIiwibmFtZSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkRyb3Bab25lIiwibXVsdGlwbGUiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFHQSxNQUFNQSxjQUFjLEdBQUlDLEtBQUssSUFBSztJQUNoQyxNQUFNO01BQUVDLFFBQVE7RUFBRUMsSUFBQUE7S0FBVSxHQUFHRixLQUFLLENBQUM7O0lBRXJDLE1BQU1HLFVBQVUsR0FBSUMsS0FBSyxJQUFLO0VBQzVCO0VBQ0FGLElBQUFBLFFBQVEsQ0FBQ0QsUUFBUSxDQUFDSSxJQUFJLEVBQUVELEtBQUssQ0FBQztJQUNoQyxDQUFDO0VBRUQsRUFBQSxvQkFDRUUsc0JBQUEsQ0FBQUMsYUFBQSxDQUFDQyxxQkFBUSxFQUFBO0VBQ1BOLElBQUFBLFFBQVEsRUFBRUMsVUFBVztNQUNyQk0sUUFBUSxFQUFFLElBQUs7RUFBRTtFQUNqQkosSUFBQUEsSUFBSSxFQUFFSixRQUFRLENBQUNJLElBQUs7RUFBRSxHQUN2QixDQUFDO0VBRU4sQ0FBQzs7RUNsQkRLLE9BQU8sQ0FBQ0MsY0FBYyxHQUFHLEVBQUU7RUFFM0JELE9BQU8sQ0FBQ0MsY0FBYyxDQUFDWixjQUFjLEdBQUdBLGNBQWM7Ozs7OzsifQ==
