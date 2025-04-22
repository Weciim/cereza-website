import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase/config";

async function createAdmin(email, password, name, role = "admin") {
  try {
    // First check if email is valid
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email address");
    }

    // Check password meets requirements
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );

    // Create admin document in Firestore
    await setDoc(doc(db, "admins", userCredential.user.uid), {
      email: email,
      name: name,
      role: role,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });

    console.log(`✅ Admin created successfully: ${email}`);
    return {
      success: true,
      uid: userCredential.user.uid,
      email: userCredential.user.email
    };
    
  } catch (error) {
    console.error(`❌ Error creating admin ${email}:`, error.code, error.message);
    
    // Handle specific Firebase errors
    let errorMessage = "Failed to create admin";
    switch(error.code) {
      case "auth/email-already-in-use":
        errorMessage = "Email already in use";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email format";
        break;
      case "auth/weak-password":
        errorMessage = "Password is too weak";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection";
        break;
      default:
        errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      code: error.code
    };
  }
}

export { createAdmin };