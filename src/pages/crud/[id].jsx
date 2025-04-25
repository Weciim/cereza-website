"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, Row, Col, Button, Badge } from "react-bootstrap"
import Layout from "./components/Layout"
import { ArrowLeft, PencilSquare } from "react-bootstrap-icons"

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

export default function ProductDetails() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)

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

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" className="d-flex align-items-center" onClick={() => router.push("/crud")}>
          <ArrowLeft className="me-2" /> Back to Products
        </Button>
        <Button
          variant="outline-primary"
          className="d-flex align-items-center"
          onClick={() => router.push(`/crud/edit/${product.id}`)}
        >
          <PencilSquare className="me-2" /> Edit Product
        </Button>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <div className="product-image mb-3 mb-md-0">
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                />
              </div>
            </Col>
            <Col md={8}>
              <div className="d-flex justify-content-between align-items-start">
                <h1 className="mb-3">{product.name}</h1>
                {product.featured && (
                  <Badge bg="warning" text="dark" className="px-3 py-2">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="mb-4">
                <Badge
                  style={{
                    backgroundColor:
                      product.category === "Lips" ? "#ffcdd2" : product.category === "Face" ? "#bbdefb" : "#c8e6c9",
                    color:
                      product.category === "Lips" ? "#c62828" : product.category === "Face" ? "#1565c0" : "#2e7d32",
                    padding: "8px 12px",
                    fontSize: "0.9rem",
                  }}
                >
                  {product.category}
                </Badge>
              </div>

              <h2 className="text-primary mb-3" style={{ color: "#cb1f28" }}>
                ${product.price.toFixed(2)}
              </h2>

              <div className="mb-4">
                <p className="mb-1">
                  <strong>Stock:</strong> {product.stock} units
                </p>
                <p className="mb-1">
                  <strong>ID:</strong> {product.id}
                </p>
              </div>

              <div className="mb-4">
                <h5>Description</h5>
                <p>{product.description || "No description available."}</p>
              </div>

              <div className="stock-indicator mb-4">
                <h5>Stock Status</h5>
                <div className="progress" style={{ height: "25px" }}>
                  <div
                    className={`progress-bar ${product.stock > 30 ? "bg-success" : product.stock > 10 ? "bg-warning" : "bg-danger"}`}
                    role="progressbar"
                    style={{ width: `${Math.min(product.stock, 100)}%` }}
                    aria-valuenow={product.stock}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {product.stock} in stock
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Layout>
  )
}
