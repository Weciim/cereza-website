import { useState } from "react";
import Link from "next/link";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import Layout from "./components/Layout";
import { Search, Plus, Trash, PencilSquare, Eye } from "react-bootstrap-icons";
import { useGetAllProductsQuery } from "@/redux/features/productApi";

export default function ProductList() {
  const { data: productsData, isError, isLoading } = useGetAllProductsQuery();
  const products = productsData?.data;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Filter products based on search term and filters
  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" ||
      product?.category?.name === filterCategory ||
      product?.category === filterCategory;
    const matchesFeatured = !showFeaturedOnly || product?.featured;
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  // Delete product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // You'll need to implement actual deletion logic here
      console.log("Delete product with id:", id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Products</h1>
        <Link href="/crud/add" passHref>
          <Button
            variant="primary"
            style={{ backgroundColor: "#cb1f28", borderColor: "#cb1f28" }}
          >
            <Plus className="me-2" /> Add Product
          </Button>
        </Link>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Lips">Lips</option>
                <option value="Face">Face</option>
                <option value="Eyes">Eyes</option>
                <option value="Crème">Crème</option>
                <option value="skincare">Skincare</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Check
                type="switch"
                id="featured-switch"
                label="Featured Only"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product) => (
                  <tr key={product.id || product.itemID}>
                    <td>{product.sku || product.id}</td>
                    <td>{product.title || product.name}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            product.category?.name === "Lips" ||
                            product.category === "Lips"
                              ? "#ffcdd2"
                              : product.category?.name === "Face" ||
                                product.category === "Face"
                              ? "#bbdefb"
                              : product.category?.name === "Eyes" ||
                                product.category === "Eyes"
                              ? "#c8e6c9"
                              : "#f0e6ff",
                          color:
                            product.category?.name === "Lips" ||
                            product.category === "Lips"
                              ? "#c62828"
                              : product.category?.name === "Face" ||
                                product.category === "Face"
                              ? "#1565c0"
                              : product.category?.name === "Eyes" ||
                                product.category === "Eyes"
                              ? "#2e7d32"
                              : "#5e35b1",
                          padding: "6px 10px",
                        }}
                      >
                        {product.category?.name || product.category}
                      </span>
                    </td>
                    <td>${product.price?.toFixed(2)}</td>
                    <td>
                      {product.stock ||
                        (product.status === "in-stock"
                          ? "In Stock"
                          : "Out of Stock")}
                    </td>
                    <td>
                      {product.featured ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-secondary">No</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          href={`/crud/${product.id || product.itemID}`}
                          passHref
                        >
                          <Button variant="outline-info" size="sm">
                            <Eye />
                          </Button>
                        </Link>
                        <Link
                          href={`/crud/edit/${product.id || product.itemID}`}
                          passHref
                        >
                          <Button variant="outline-primary" size="sm">
                            <PencilSquare />
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            handleDelete(product.id || product.itemID)
                          }
                        >
                          <Trash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No products found. Try adjusting your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Layout>
  );
}
