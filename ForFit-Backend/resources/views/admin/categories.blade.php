@extends('layouts.app')

@section('title', 'Categories Management')
@section('content')

    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
        .image-preview {
            width: 100px;
            height: 100px;
            object-fit: cover;
            margin: 5px;
        }
    </style>

    <div class="container mt-5">
        <h1>Categories Management</h1>
        <button class="btn btn-primary mb-3" data-toggle="modal" data-target="#categoryModal" onclick="openAddModal()">Add Category</button>
        
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($categories as $category)
                <tr>
                    <td>{{ $category->id }}</td>
                    <td>{{ $category->category_name }}</td>
                    <td>
                        @if ($category->cimage)
                        <img src="{{Storage::url('category_images/'.$category->cimage) }}" class="image-preview" alt="Category Image">
                        @else
                            No Image
                        @endif
                    </td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="openEditModal({{ $category->id }}, '{{ $category->category_name }}', '{{ $category->cimage }}')">Edit</button>
                        <form action="{{ route('categories.destroy', $category->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="modal fade" id="categoryModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">Add New Category</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="categoryForm" method="POST" enctype="multipart/form-data">
                        @csrf
                        <input type="hidden" id="formMethod" name="_method" value="POST">
                        <div class="form-group">
                            <label for="category_name">Name</label>
                            <input type="text" name="category_name" id="category_name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="cimage">Image</label>
                            <input type="file" name="cimage" id="cimage" class="form-control-file" accept="image/*">
                        </div>
                        <div class="form-group text-right">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" id="modalSubmitButton">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>
    <script>
        function openAddModal() {
            $('#modalTitle').text('Add New Category');
            $('#formMethod').val('POST');
            $('#categoryForm').attr('action', "{{ route('categories.store') }}");
            $('#category_name').val('');
            $('#cimage').val('');
            $('#modalSubmitButton').text('Save');
            $('#categoryModal').modal('show');
        }

        function openEditModal(id, name, imageUrl) {
            $('#modalTitle').text('Edit Category');
            $('#formMethod').val('PUT');
            $('#categoryForm').attr('action', `/admin/categories/${id}`);
            $('#category_name').val(name);
            if (imageUrl) {
                console.log(imageUrl);
                $('#imagePreview').attr('src', imageUrl).show();
            }
            $('#modalSubmitButton').text('Update');
            $('#categoryModal').modal('show');
        }
    </script>
@endsection
