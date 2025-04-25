
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Form, Button, Card, Row, Col } from "react-bootstrap"
import Layout from "../components/Layout"

// Sample data - in a real app, you would fetch this from an API
const initialProducts = [
  {
    id: 1,
    name: "Matte Lipstick",
    category: "Lips",
    price: 19.99,
    stock: 45,
    featured: true,
    description: "Long-lasting matte finish lipstick in a variety of shades.",
    imageUrl: "https://via.placeholder.com/300x300?text=Lipstick",
  },
  {
    id: 2,
    name: "Foundation SPF 15",
    category: "Face",
    price: 34.99,
    stock: 28,
    featured: false,
    description: "Medium coverage foundation with SPF protection.",
    imageUrl: "https://via.placeholder.com/300x300?text=Foundation",
  },
  {
    id: 3,
    name: "Volumizing Mascara",
    category: "Eyes",
    price: 24.99,
    stock: 60,
    featured: true,
    description: "Adds volume and length to lashes without clumping.",
    imageUrl: "https://via.placeholder.com/300x300?text=Mascara",
  },
  {
    id: 4,
    name: "Eyeshadow Palette",
    category: "Eyes",
    price: 42.99,
    stock: 15,
    featured: true,
    description: "Palette with 12 highly pigmented eyeshadow colors.",
    imageUrl: "https://via.placeholder.com/300x300?text=Eyeshadow",
  },
]

export default function EditProduct() {
  const router = useRouter()
  const { id } = router.query
  const [validated, setValidated] = useState(false)
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    featured: false,
    imageUrl: "",
  })

  useEffect(() => {
    if (id) {
      // Find product by ID - in a real app, you would fetch this from an API
      const foundProduct = initialProducts.find((p) => p.id === Number.parseInt(id))
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        router.push("/crud")
      }
    }
  }, [id, router])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    // Here you would typically update the product in your database
    console.log("Product updated:", product)

    // Redirect back to product list
    router.push("/crud")
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Edit Product</h1>
        <Button variant="outline-secondary" onClick={() => router.push("/crud")}>
          Cancel
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                  />
                  <Form.Control.Feedback type="invalid">Please provide a product name.</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select required name="category" value={product.category} onChange={handleChange}>
                        <option value="">Select category</option>
                        <option value="Lips">Lips</option>
                        <option value="Face">Face</option>
                        <option value="Eyes">Eyes</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">Please select a category.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="imageUrl"
                        value={product.imageUrl}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price ($)</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        placeholder="0.00"
                      />
                      <Form.Control.Feedback type="invalid">Please provide a valid price.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        min="0"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        placeholder="0"
                      />
                      <Form.Control.Feedback type="invalid">Please provide a valid stock amount.</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Featured Product"
                    name="featured"
                    checked={product.featured}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <div className="product-image-preview mb-3">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt="Product preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: "300px", width: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="placeholder-image d-flex justify-content-center align-items-center bg-light rounded"
                      style={{ height: "300px" }}
                    >
                      <span className="text-muted">Product Image Preview</span>
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => router.push("/crud")}>
                Cancel
              </Button>
              <Button type="submit" style={{ backgroundColor: "#cb1f28", borderColor: "#cb1f28" }}>
                Update Product
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  )
}
