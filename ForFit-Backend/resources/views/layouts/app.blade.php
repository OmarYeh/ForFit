<!-- resources/views/layouts/app.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title')</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background-color: #f5f6fa;
        }

        .container {
            min-height: 100vh;
        }
        
        .sidebar {
            background-color: #2c3e50;
            color: white;
            width: 250px;
            min-height: 100vh;
            transition: all 0.3s;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
        }

        .sidebar-header {
            padding: 20px;
            background-color: #34495e;
            text-align: center;
        }

        .sidebar-menu {
            padding: 20px 0;
        }

        .sidebar-menu a {
            color: #bdc3c7;
            text-decoration: none;
            padding: 15px 25px;
            display: block;
            transition: all 0.3s;
        }

        .sidebar-menu a:hover {
            background-color: #34495e;
            color: white;
        }

        .sidebar-menu a.active {
            background-color: #3498db;
            color: white;
        }

         /* Header Styles */
         .header {
            position: fixed;
            top: 0;
            left: 250px; 
            right: 0;
            background-color: #34495e;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .logo img {
            width: 150px;
            height: 40px;
            object-fit: contain;
        }

        .logout-btn {
            background-color: #e74c3c;
            color: white;
            padding: 8px 20px;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        .logout-btn:hover {
            background-color: #c0392b;
        }

        .main-content {
            padding: 30px;
            display: flex;
            align-items: center;
            justify-content: center;

        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .sidebar {
                left: -250px;
            }
            
            .header {
                margin-left: 0;
            }

            .main-content {
                margin-left: 0;
            }

            .sidebar.active {
                left: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h2>Admin Panel</h2>
            </div>
            <nav class="sidebar-menu">
                <a href="{{ route('admin.dashboard') }}" class="{{ request()->routeIs('dashboard') ? 'active' : '' }}">
                    Dashboard
                </a>
                <a href="{{ route('admin.colors') }}" class="{{ request()->routeIs('colors') ? 'active' : '' }}">
                    Colors
                </a>
                <a href="{{ route('admin.categories') }}" class="{{ request()->routeIs('categories') ? 'active' : '' }}">
                    Categories
                </a>
                <a href="{{ route('admin.sales') }}" class="{{ request()->routeIs('sales') ? 'active' : '' }}">
                    sales
                </a>
            </nav>
        </div>

        <header class="header">
            <div class="logo">
                <a href="{{ route('admin.dashboard') }}" class="{{ request()->routeIs('dashboard') ? 'active' : '' }}">
                <img src="{{ asset('storage/shopping-app.png') }}" alt="Logo">
                </a>
            </div>            
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="logout-btn">Logout</button>
            </form>
        </header>

        <main class="main-content">
            @yield('content')
        </main>
    </div>

    <!-- Mobile Menu Toggle Script -->
    <script>
        // Add mobile menu toggle functionality if needed
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('active');
        }
    </script>
</body>
</html>