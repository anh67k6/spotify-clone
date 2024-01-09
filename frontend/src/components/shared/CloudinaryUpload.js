import { openUploadWidget } from "../../utils/CloudinaryService";

const CloudinaryUpload = ({
  setUrl,
  setName,
  resourceType,
  multiple,
  clientAllowedFormats,
  title,
  className,
}) => {
  const uploadImageWidget = () => {
    let myUploadWidget = openUploadWidget(
      {
        cloudName: "djpybgikt",
        uploadPreset: "jmyyrx6t",

        sources: ["local"],
        resourceType,
        multiple,
        clientAllowedFormats,
      },
      function (error, result) {
        if (!error && result.event === "success") {
          setUrl(result.info.secure_url);
          setName(result.info.original_filename);
        } else {
          if (error) {
            console.log(error);
          }
        }
      }
    );
    myUploadWidget.open();
  };

  return (
    <button
      className={`bg-white text-black  rounded-full p-4 font-semibold ${className} whitespace-nowrap`}
      onClick={uploadImageWidget}
    >
      {title}
    </button>
  );
};

export default CloudinaryUpload;
