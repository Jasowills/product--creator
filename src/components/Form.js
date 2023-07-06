import React, { useState } from "react";

function Form() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: productName,
      description: description,
      category: category,
      price: productPrice,
      image: await convertImageToString(productImage),
    };

    try {
      const response = await fetch(
        "https://indigo-indri-slip.cyclic.app/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        console.log("Product added successfully!");
        // Reset the form fields
        setProductName("");
        setProductPrice("");
        setCategory("");
        setDescription("");
        setProductImage(null);
      } else {
        console.error("Error adding product:", response.status);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedImageData = canvas.toDataURL("image/jpeg", 0.8);
        setProductImage(compressedImageData);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const convertImageToString = (image) => {
    if (!image) return "";

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open("GET", image);
      xhr.responseType = "blob";
      xhr.send();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Product Name:
        <input
          type="text"
          required
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </label>

      <label>
        Product Price:
        <input
          type="number"
          required
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
      </label>

      <label>
        Category:
        <select
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        >
          <option disabled value="">
            Select a category
          </option>
          <option value="Electronics">Electronics</option>
          <option value="Skin care">Health & beauty</option>
          <option value="Food">Food</option>
          <option value="Phones & tablets">Phones & tablets</option>
          <option value="Appliances">Appliances</option>
          <option value="Fashion">Fashion</option>
          <option value="Gaming">Gaming</option>
          {/* Add more options as needed */}
        </select>
      </label>

      <label>
        Description:
        <input
          required
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label>
        Product Image:
        <input type="file" onChange={handleImageChange} accept="image/*" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
