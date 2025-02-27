@extends('layouts.app')
@php

    $method = 'PUT';
@endphp
@section('title', 'Sales Management')
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
        <h1>Sales Management</h1>
        <button class="btn btn-primary mb-3" data-toggle="modal" data-target="#salesModal" onclick="openAddModal()">Add Sales</button>
        
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Discount</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($sales as $sale)
                <tr>
                    <td>{{ $sale->id }}</td>
                    <td>{{ $sale->sale_name }}</td>
                    <td>{{ $sale->Discount }}</td>
                    <td>{{ $sale->start_date }}</td>
                    <td>{{ $sale->end_date }}</td>
                    <td>
                    <button class="btn btn-warning btn-sm" 
    onclick="openEditModal({{ $sale->id }}, `{{ $sale->sale_name }}`, {{ $sale->Discount }}, `{{ $sale->start_date }}`, `{{ $sale->end_date }}`, @json($sale->getItems->pluck('id')))">Edit</button>
 <form action="{{ route('sales.destroy', $sale->id) }}" method="POST" style="display:inline;">
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

    <div class="modal fade" id="salesModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">Add New Sales</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="salesForm" method="POST">
                        @csrf
                        <input type="hidden" id="formMethod" name="_method" value="POST">
                        <div class="form-group">
                            <label for="sales_name">Name</label>
                            <input type="text" name="sale_name" id="sale_name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="discount">Discount</label>
                            <input type="number" name="Discount" id="Discount" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="start_date">Start Date</label>
                            <input type="date" name="start_date" id="start_date" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="end_date">End Date</label>
                            <input type="date" name="end_date" id="end_date" class="form-control" required>
                        </div>
                        
                 <!--       <div class="form-group">
                            <label for="items">Select Items</label>
                            <select name="items[]" id="items" class="form-control select2" multiple required>
                                @foreach($items as $item)
                                    <option value="{{ $item->id }}">{{ $item->name }}</option>
                                @endforeach
                            </select>
                        </div>-->
                        <div class="form-group text-right">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" id="modalSubmitButton">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="editsalesModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">Edit Sale</h5>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="salesForm" method="POST" action="{{ route('updatesale', $sale->id) }}">
                        @csrf
                        @method($method)
                        <div class="form-group">
                            <label for="sales_name">Name</label>
                            <input type="text" name="sale_name" id="sale_namee" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="discount">Discount</label>
                            <input type="number" name="Discount" id="Discounte" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="start_date">Start Date</label>
                            <input type="date" name="start_date" id="start_datee" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="end_date">End Date</label>
                            <input type="date" name="end_date" id="end_datee" class="form-control" required>
                        </div>
                        
                       <div class="form-group" >
                            <label for="items">Select Items</label>
                            <select name="items[]" id="itemse"  style="width: 300px;" class="form-control select2" multiple required>
                                @foreach($items as $item)
                                    <option value="{{ $item->id }}">{{ $item->item_name }}</option>
                                @endforeach
                            </select>
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
    <script>
        $(document).ready(function() {
            $('.select2').select2();
            
        });

        function openAddModal() {
            $('#modalTitle').text('Add New Sales');
            $('#formMethod').val('POST');
            $('#salesForm').attr('action', "{{ route('addsale') }}");
            $('#sales_name').val('');
            $('#discount').val('');
            $('#start_date').val('');
            $('#end_date').val('');
            $('#items').val(null).trigger('change');
            $('#modalSubmitButton').text('Save');
            $('#salesModal').modal('show');
        }

        function openEditModal(id, name, discount, startDate, endDate,selectedItemIds) {
            console.log(selectedItemIds);
            var startDateOnly = startDate.split(' ')[0];  // Extract 'YYYY-MM-DD'
            var endDateOnly = endDate.split(' ')[0];
            $('#sale_namee').val(name);
            $('#Discounte').val(discount);
            $('#start_datee').val(startDateOnly);
            $('#end_datee').val(endDateOnly);
            $('#itemse').val(selectedItemIds).trigger('change');
            $('#modalSubmitButton').text('Update');
            $('#editsalesModal').modal('show');
        }
    </script>
@endsection
