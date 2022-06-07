import React, { useState, useRef } from "react";
import axios from "axios";
import process from "process";

export default function ItemModal() {
  const itemid = "32574";
  const imgUpload = useRef(null);
  const [img, setImg] = useState("");

  function previewImage() {
    var oFReader = new FileReader();
    oFReader.readAsDataURL(imgUpload.current.files[0]);
    oFReader.onload = function (oFREvent) {
      setImg(oFREvent.target.result as string);
    };
  }

  function updateItem() {
    if (imgUpload.current.files.length > 0) {
      var formData = new FormData();
      let file = imgUpload.current.files[0];
      formData.append("file", file);
      formData.append("title", file.name);
      formData.append("post", itemid); //coming from props
      let headers = {};
      headers["Content-Type"] = "multipart/form-data";
      headers["Accept"] = "application/json";
      headers["Content-Disposition"] =
        "attachment; filename='" + file.name + "'";
      headers["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsIm5hbWUiOiJKcHJpZXRvIiwiaWF0IjoxNjU0NTcxNjMwLCJleHAiOjE4MTIyNTE2MzB9.UUX7XDNpaugrkYBnQaAXtL-f3JGbfdNNqESNUKeifqQ";

      axios
        .post( "https://tornicentro.com.co/wp-json/wp/v2/media/", file, headers)
        .then(function (resp) {
          console.log(resp);
        });
    }
  }

  return (
    <div>
      {(() => {
        if (img) {
          return <img src={img} alt="image" />;
        }
      })()}
      <input
        id="imgUpload"
        type="file"
        ref={imgUpload}
        onChange={previewImage}
      />
      <button onClick={updateItem}>Update</button>
    </div>
  );
}
