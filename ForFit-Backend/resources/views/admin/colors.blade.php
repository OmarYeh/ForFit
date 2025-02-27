@extends('layouts.app')

@section('title', 'Colors Management')
@section('content')

    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <!-- Spectrum Color Picker CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.1/spectrum.min.css" rel="stylesheet" />
    <style>
        .selected-item { padding: 5px 10px; background-color: #f8f9fa; border-radius: 5px; margin: 2px; display: inline-block; }
        .selected-item button { border: none; background: none; color: #dc3545; padding: 0 5px; }
        .image-preview { width: 100px; height: 100px; object-fit: cover; margin: 5px; }
        .sp-replacer { padding: 0; border: none; background: none; }
        .sp-preview { margin-right: 0; }
    </style>

    <div class="container mt-5">
        <h1>Colors Management</h1>
        <button class="btn btn-primary mb-3" data-toggle="modal" data-target="#colorModal" onclick="openAddModal()">Add Color</button>        
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Hexcode</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($colors as $color)
                <tr>
                    <td>{{ $color->id }}</td>
                    <td>{{ $color->name }}</td>
                    <td>
                        <div style="background-color: {{ $color->Hexcode }}; width: 50px; height: 20px;"></div>
                        {{ $color->Hexcode }}
                    </td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="openEditModal({{ $color->id }}, '{{ $color->name }}', '{{ $color->Hexcode }}')">Edit</button>
                        <form action="{{ route('colors.destroy', $color->id) }}" method="POST" style="display:inline;">
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

    <div class="modal fade" id="colorModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">Add New Color</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="colorForm" method="POST">
                        @csrf
                        <input type="hidden" id="formMethod" name="_method" value="POST">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" id="name" class="form-control" required>
                        </div>
                        <div class="form-group">
    <label for="Hexcode">Hexcode</label>
    <div class="input-group">
        <!-- Text input for hex code -->
        <input type="text" name="Hexcode" id="Hexcode" class="form-control" required>
        
        <!-- Palette icon for opening the color picker -->
        <div class="input-group-append">
            <span class="input-group-text" id="colorPickerIcon"><i class="fas fa-palette"></i></span>
        </div>
    </div>
</div>

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
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.1/spectrum.min.js"></script>
    <script>

        $('#Hexcode').spectrum({
            color: '#ffffff',
            preferredFormat: 'hex',
            showInput: true,
            showInitial: true,
            allowEmpty: false,
            showPalette: true,
            palette: [
                ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'],
                ['#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080']
            ],
            change: function(color) {
                $('#Hexcode').val(color.toHexString());
            }
        });

        $('#colorPickerIcon').click(function() {
            $('#Hexcode').spectrum('show');
        });

        function openAddModal() {
            $('#modalTitle').text('Add New Color');
            $('#formMethod').val('POST');
            $('#colorForm').attr('action', "{{ route('colors.store') }}");
            $('#name').val('');
            $('#Hexcode').val('#ffffff'); 
            $('#modalSubmitButton').text('Save');
            $('#colorModal').modal('show');
        }

        function openEditModal(id, name, hexcode) {
    $('#modalTitle').text('Edit Color');
    $('#formMethod').val('PUT'); 
    $('#colorForm').attr('action', `/admin/colors/${id}`);
    $('#name').val(name);
    $('#Hexcode').val(hexcode);
    $('#modalSubmitButton').text('Update');
    $('#colorModal').modal('show');
}

    </script>
@endsection