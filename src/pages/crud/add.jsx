import React, { useState } from "react";
import { Form, Button, Row, Col, Card, Badge } from "react-bootstrap";
import {
  Plus as BoxPlus,
  XCircle,
  CloudUpload,
  CardImage,
  InfoCircle,
} from "react-bootstrap-icons";
import { db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import Layout from "./components/Layout";
import Image from "next/image";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    discount: "",
    productType: "",
    unit: "",
    status: "in-stock",
    description: "",
    featured: false,
    sizes: "",
    tags: [],
    images: [],
    additionalInfo: [{ key: "", value: "" }],
  });

  const [newTag, setNewTag] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cereza-test");

    setUploading(true); // show loader

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/duftqflob/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, data.secure_url],
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAdditionalInfoChange = (index, field, value) => {
    const updated = [...product.additionalInfo];
    updated[index][field] = value;
    setProduct((prev) => ({ ...prev, additionalInfo: updated }));
  };

  const handleAddAdditionalInfo = () => {
    setProduct((prev) => ({
      ...prev,
      additionalInfo: [...prev.additionalInfo, { key: "", value: "" }],
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !product.tags.includes(newTag.trim())) {
      setProduct((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (index) => {
    setProduct((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), product);
      alert("Product added successfully!");
      setProduct({
        name: "",
        category: "",
        price: "",
        stock: "",
        discount: "",
        productType: "",
        unit: "",
        status: "in-stock",
        description: "",
        featured: false,
        sizes: "",
        tags: [],
        images: [],
        additionalInfo: [{ key: "", value: "" }],
      });
    } catch (err) {
      console.error("Error adding product", err);
    }
  };

  const categories = ["PROTECT", "PERFECT", "PURE"];
  const productTypes = ["Skincare", "BodyCare", "Serum", "Crème hydratante"];

  const formFields = [
    { name: "name", label: "Product Name", placeholder: "Enter product name" },
    { name: "price", label: "Price ($)", placeholder: "0.00", type: "number" },
    {
      name: "stock",
      label: "Stock Quantity",
      placeholder: "0",
      type: "number",
    },
    {
      name: "discount",
      label: "Discount (%)",
      placeholder: "0",
      type: "number",
    },
    { name: "unit", label: "Unit", placeholder: "e.g. oz, ml, g" },
    {
      name: "sizes",
      label: "Available Sizes",
      placeholder: "e.g. 30ml, 50ml (comma separated)",
    },
  ];

  return (
    <Layout>
      <Card className="border-0 shadow-sm">
        <Card.Header
          className="bg-white border-bottom"
          style={{ borderLeft: `4px solid #cb1f28` }}
        >
          <h2 className="mb-0 py-2" style={{ color: "#cb1f28" }}>
            Add New Product
          </h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Basic Information</h5>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Product Name</Form.Label>
                          <Form.Control
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                            className="border-0 shadow-sm"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Category</Form.Label>
                          <Form.Select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            className="border-0 shadow-sm"
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Product Type</Form.Label>
                          <Form.Select
                            name="productType"
                            value={product.productType}
                            onChange={handleChange}
                            className="border-0 shadow-sm"
                          >
                            <option value="">Select Type</option>
                            {productTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <h5 className="mb-3 mt-4">Product Details</h5>
                    <Row>
                      {formFields.map((field) => (
                        <Col md={6} key={field.name}>
                          <Form.Group className="mb-3">
                            <Form.Label>{field.label}</Form.Label>
                            <Form.Control
                              name={field.name}
                              value={product[field.name]}
                              onChange={handleChange}
                              placeholder={field.placeholder}
                              type={field.type || "text"}
                              className="border-0 shadow-sm"
                            />
                          </Form.Group>
                        </Col>
                      ))}
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Enter detailed product description..."
                        className="border-0 shadow-sm"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Tags</Form.Label>
                      <div className="d-flex mb-2">
                        <Form.Control
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag (e.g. hydrating)"
                          className="border-0 shadow-sm me-2"
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={handleAddTag}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            bg="light"
                            text="dark"
                            className="d-flex align-items-center"
                          >
                            {tag}
                            <Button
                              variant="link"
                              className="p-0 ms-2 text-danger"
                              onClick={() => handleRemoveTag(index)}
                            >
                              <XCircle size={14} />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Additional Information</h5>
                    <Form.Label>
                      Ingredients, Benefits, How to Use, etc.
                    </Form.Label>
                    {product.additionalInfo.map((info, idx) => (
                      <Row key={idx} className="mb-2 align-items-center">
                        <Col md={5}>
                          <Form.Control
                            placeholder="Property (e.g. Ingredients)"
                            value={info.key}
                            onChange={(e) =>
                              handleAdditionalInfoChange(
                                idx,
                                "key",
                                e.target.value
                              )
                            }
                            className="border-0 shadow-sm"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Control
                            placeholder="Value"
                            value={info.value}
                            onChange={(e) =>
                              handleAdditionalInfoChange(
                                idx,
                                "value",
                                e.target.value
                              )
                            }
                            className="border-0 shadow-sm"
                          />
                        </Col>
                        <Col md={1} className="text-center">
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => {
                              setProduct((prev) => ({
                                ...prev,
                                additionalInfo: prev.additionalInfo.filter(
                                  (_, i) => i !== idx
                                ),
                              }));
                            }}
                          >
                            <XCircle size={18} />
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleAddAdditionalInfo}
                      className="mt-2"
                    >
                      <BoxPlus size={16} className="me-1" /> Add Information
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Product Status</h5>
                    <Form.Group className="mb-3">
                      <Form.Label>Availability</Form.Label>
                      <Form.Select
                        name="status"
                        value={product.status}
                        onChange={handleChange}
                        className="border-0 shadow-sm"
                      >
                        <option value="in-stock">In Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                        <option value="coming-soon">Coming Soon</option>
                        <option value="discontinued">Discontinued</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="featured-switch"
                        label="Featured Product"
                        name="featured"
                        checked={product.featured}
                        onChange={handleChange}
                        className="mb-2"
                      />
                      <small className="text-muted d-block">
                        <InfoCircle size={14} className="me-1" />
                        Featured products appear on the homepage
                      </small>
                    </Form.Group>
                  </Card.Body>
                </Card>

                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Product Images</h5>

                    {product.images.length === 0 && (
                      <div className="text-center p-4 bg-light rounded mb-3">
                        <CardImage size={30} className="text-muted mb-2" />
                        <p className="text-muted small mb-0">
                          No images uploaded yet
                        </p>
                      </div>
                    )}

                    {product.images.map((url, idx) => (
                      <div key={idx} className="position-relative mb-3">
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "150px",
                          }}
                        >
                          <Image
                            src={url}
                            alt={`product-${idx}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{ objectFit: "cover" }}
                            className="rounded"
                          />
                        </div>
                        <Badge
                          bg="light"
                          text="dark"
                          className="position-absolute top-0 start-0 m-2"
                        >
                          {idx === 0 ? "Main" : `Image ${idx + 1}`}
                        </Badge>
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-2"
                          onClick={() => handleRemoveImage(idx)}
                        >
                          <XCircle size={16} />
                        </Button>
                      </div>
                    ))}

                    <div className="mt-3">
                      <div className="d-grid">
                        <Button
                          variant="outline-secondary"
                          className="position-relative text-start ps-5 py-3"
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          }
                          disabled={uploading}
                        >
                          <input
                            type="file"
                            id="fileInput"
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                            accept="image/*"
                          />
                          <CloudUpload
                            size={24}
                            className="position-absolute"
                            style={{
                              left: "1rem",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          />
                          <span>Upload Image</span>
                          {uploading && (
                            <span
                              className="spinner-border spinner-border-sm position-absolute"
                              style={{
                                right: "1rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                              role="status"
                            />
                          )}
                        </Button>
                      </div>
                      <div className="small text-muted mt-2">
                        <InfoCircle size={14} className="me-1" />
                        Recommended size: 800x800px, JPEG or PNG
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="outline-secondary" className="me-2">
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                style={{
                  backgroundColor: "#cb1f28",
                  borderColor: "#cb1f28",
                }}
              >
                Save Product
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
}