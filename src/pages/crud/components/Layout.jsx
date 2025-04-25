"use client"

import Head from "next/head"
import { Container, Navbar, Nav } from "react-bootstrap"
import { BoxSeam, Palette, House, Gear } from "react-bootstrap-icons"
import Link from "next/link"

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Makeup Store Admin</title>
        <meta name="description" content="Admin panel for makeup store" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
          crossOrigin="anonymous"
        />
        <style jsx global>{`
          :root {
            --brand-color: #cb1f28;
            --brand-color-light: #f8d7da;
          }
          
          body {
            background-color: #f8f9fa;
          }
          
          .sidebar {
            min-height: calc(100vh - 56px);
            background-color: white;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          }
          
          .sidebar .nav-link {
            color: #495057;
            border-radius: 0;
            padding: 0.75rem 1.25rem;
          }
          
          .sidebar .nav-link:hover {
            background-color: #f8f9fa;
          }
          
          .sidebar .nav-link.active {
            color: var(--brand-color);
            background-color: var(--brand-color-light);
            border-left: 4px solid var(--brand-color);
          }
          
          .sidebar .nav-link svg {
            margin-right: 0.5rem;
          }
          
          .main-content {
            padding: 2rem;
          }
          
          .navbar-brand {
            color: var(--brand-color) !important;
            font-weight: bold;
          }
          
          .btn-primary {
            background-color: var(--brand-color);
            border-color: var(--brand-color);
          }
          
          .btn-primary:hover, .btn-primary:focus {
            background-color: #a61922;
            border-color: #a61922;
          }
        `}</style>
      </Head>

      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="/crud" style={{ color: "#cb1f28" }}>
            <Palette className="me-2" />
            Store Admin
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#" className="d-flex align-items-center">
                <Gear className="me-1" /> Settings
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="p-0">
        <div className="d-flex">
          <div className="sidebar d-none d-md-block" style={{ width: "250px" }}>
            <Nav className="flex-column">
              <Link href="/dashboard" passHref>
                <Nav.Link className="d-flex align-items-center">
                  <House size={18} /> Dashboard
                </Nav.Link>
              </Link>
              <Link href="/crud" passHref>
                <Nav.Link className="d-flex align-items-center active">
                  <BoxSeam size={18} /> Products
                </Nav.Link>
              </Link>
            </Nav>
          </div>
          <div className="main-content flex-grow-1">{children}</div>
        </div>
      </Container>
    </>
  )
}
