@extends('layouts.app')

@section('title', 'Dashboard')
  @section('content')

    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
        .selected-item { padding: 5px 10px; background-color: #f8f9fa; border-radius: 5px; margin: 2px; display: inline-block; }
        .selected-item button { border: none; background: none; color: #dc3545; padding: 0 5px; }
        .image-preview { width: 100px; height: 100px; object-fit: cover; margin: 5px; }
    </style>

  <div class="container mt-5">
        <h1>Items Management</h1>
        <button class="btn btn-primary mb-3" data-toggle="modal" data-target="#addModal">Add Item</button>        
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($items as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->item_name }}</td>
                    <td>{{ $item->price }}</td>
                    <td>{{ $item->rating }}</td>
                    <td>{{ Str::limit($item->description, 50) }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editItem({{ $item->id }})">Edit</button>
                        <form action="{{ route('items.destroy', $item->id) }}" method="POST" style="display:inline;">
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

    <div class="modal fade" id="addModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                @include('admin.partials.item-form', [
                    'item' => null,
                    'currencies' => $currencies,
                    'colors' => $colors,
                    'categories' => $categories
                ])
              
            </div>
        </div>
    </div>

    <div class="modal fade" id="editModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
            @include('admin.partials.edit_item_form', [
                    'item' => $item,
                    'currencies' => $currencies,
                    'colors' => $colors,
                    'categories' => $categories
                ])
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script>
        
        function editItem(itemId) {
            fetch(`/admin/items/${itemId}/edit`)
                .then(response => response.text())
                .then(html => {
                    $('#editModal .modal-content').html(html);
                    initSelect2();
                    $('#editModal').modal('show');
                });
        }

        function initSelect2() {
            $('#colors, #categories').select2({
                placeholder: 'Select options',
                allowClear: true
            }).trigger('change');
        }

        // Initialize for add modal
        $(document).ready(function() {
            $('#addModal').on('shown.bs.modal', function() {
                initSelect2();
            });
        });
    </script>
@endsection