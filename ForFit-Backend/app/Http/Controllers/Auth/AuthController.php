<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Role;
use App\Models\cart;
use App\Models\wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{ 
    public function register(Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'UserName' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'profile_picture' => 'nullable|string',
            'age' => 'nullable|integer|min:0',
        ]);
    
        // Create the user
        $user = new User();  // Initialize the user model
        
        // Decode the Base64 image if provided
        $profilePicturePath = null;
        if ($request->has('profile_picture')) {
            $imageData = base64_decode($validatedData['profile_picture']);  // Corrected to use $validatedData
            $imageName = time() . '.jpg'; // Save the image with a unique name
            $imagePath = public_path('storage/profile_pictures/' . $imageName);
            file_put_contents($imagePath, $imageData);
            $profilePicturePath = 'profile_pictures/' . $imageName;  // Save the path in a variable
        }
    
        // Now create the user
        $user->UserName = $validatedData['UserName'];
        $user->email = $validatedData['email'];
        $user->password = Hash::make($validatedData['password']);
        $user->role_id = 1; // Default role
        $user->profile_picture = $profilePicturePath;  // Save the profile picture path
        $user->age = $validatedData['age'] ?? null;
        
        // Save the user to the database
        $user->save();
        $cart = new cart();
        $cart->user_id = $user->id;
        $cart->save();

        $wishlist = new wishlist();
        $wishlist->user_id = $user->id;
        $wishlist->save();
        // Return the response
        return response()->json([
            'message' => 'Registration successful.',
            'user' => $user,
        ], 201);
    }
    
    
    // Login user
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }
    
        // Authenticate user
        $user = User::where('email', $request->email)->first();
    
        \Log::info('User found:', $user ? $user->toArray() : 'User not found');
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password',
            ], 401);
        }
    
        // Generate token for user
        $token = $user->createToken('authToken')->plainTextToken;
    
        \Log::info('Token created for user:', [
            'user_id' => $user->id,
            'tokenable_id' => $user->id, // Verify tokenable_id
            'token' => $token,
        ]);
    
        $user->remember_token = $token;
        $user->save();
    
        return response()->json([
            'success' => true,
            'user' => $user,
            'access_token' => $token,
        ], 200);
    }
    

    // Logout user
    public function logout(Request $request)
    {
        // Revoke the current access token
        $request->user()->currentAccessToken()->delete();

        return response()->json(null, 204); // 204 No Content indicates successful logout
    }

    public function getMe(Request $request)
    {
        try {
            $token = $request->bearerToken();
    
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token not provided',
                ], 400);
            }
    
            // Find user by remember_token (the token passed in the request)
            $user = User::where('remember_token', $token)->first();
    
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid token or user not found',
                ], 401);
            }
    
            return response()->json([
                'success' => true,
                'user' => $user, // Return user data
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Oops, something went wrong. Please contact the administrator.',
            ], 500);
        }
    }
    public function getUser(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
        ]);
    
        $user = User::where('email', $data['email'])->first();
    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        // Return both the UserName and the profile_picture
        return response()->json([
            'name' => $user->UserName,
            'profile_picture' => $user->profile_picture ? asset('storage/' . $user->profile_picture) : null,
            'age' => $user->age,
        ]);
    }
    
    public function checkEmail(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email',
        ]);
        $emailExists = User::where('email', $validatedData['email'])->exists();
        if ($emailExists) {
            return response()->json([
                'exists' => true,
                'message' => 'This email is already registered.',
            ]);
        }
        return response()->json([
            'exists' => false,
            'message' => 'This email is available for registration.',
        ]);
    }


  
}
