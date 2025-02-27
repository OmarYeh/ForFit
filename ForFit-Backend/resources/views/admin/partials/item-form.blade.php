@php
    // Use the store route and POST method for creating a new item.
    $route = route('items.store');
    $method = 'POST';
@endphp

<form method="POST" action="{{ $route }}" enctype="multipart/form-data" id="itemForm">
    @csrf
    @method($method)
    
    <div class="modal-header">
        <h5 class="modal-title">Add New Item</h5>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
    </div>
    
    <div class="modal-body">
        <!-- Item Name -->
        <div class="form-group">
            <label>Item Name</label>
            <input type="text" class="form-control" name="item_name" value="{{ old('item_name') }}" required>
        </div>
        
        <!-- Price -->
        <div class="form-group">
            <label>Price</label>
            <input type="number" step="0.01" class="form-control" name="price" value="{{ old('price') }}" required>
        </div>
        
        <!-- Rating -->
        <div class="form-group">
            <label>Rating</label>
            <input type="number" step="0.1" min="0" max="5" class="form-control" name="rating" value="{{ old('rating') }}">
        </div>
        
        <!-- Description -->
        <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" name="description" required>{{ old('description') }}</textarea>
        </div>
        
        <!-- Currency -->
        <div class="form-group">
            <label>Currency</label>
            <select class="form-control" name="currency_id" required>
                @foreach($currencies as $currency)
                    <option value="{{ $currency->id }}" 
                        {{ old('currency_id') == $currency->id ? 'selected' : '' }}>
                        {{ $currency->Currency_code }}
                    </option>
                @endforeach
            </select>
        </div>
        
        <!-- Sizes -->
        <div class="form-group">
            <label>Sizes</label>
            <div id="sizesContainer">
                {{-- For new items, there are no preset sizes --}}
            </div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="addSizeField()">Add Size</button>
        </div>
        
        <!-- File input to add new images -->
        <div class="form-group">
            <label for="item_image">Add New Image</label>
            <input type="file" name="item_image[]" class="form-control" id="item_image" multiple onchange="previewImages()">
        </div>

        <!-- New Images Preview -->
        <div class="new-images-preview"></div>
        
        <!-- Colors -->
        <div class="form-group">
            <label>Colors</label>
            <select name="colors[]" id="colors" class="form-control" multiple required>
                @foreach($colors as $color)
                    <option value="{{ $color->id }}" 
                        {{ in_array($color->id, old('colors', [])) ? 'selected' : '' }}>
                        {{ $color->name }}
                    </option>
                @endforeach
            </select>
            <div id="selectedColors" class="mt-2"></div>
        </div>
        
        <!-- Categories -->
        <div class="form-group">
            <label>Categories</label>
            <select name="cat_ids[]" id="categories" class="form-control" multiple required>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}" 
                        {{ in_array($category->id, old('cat_ids', [])) ? 'selected' : '' }}>
                        {{ $category->category_name }}
                    </option>
                @endforeach
            </select>
            <div id="selectedCategories" class="mt-2"></div>
        </div>
    </div>
    
    <!-- Modal Footer -->
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary">Save</button>
    </div>
</form>

<script>
    // For new items, initialize sizeIndex at 0.
    let sizeIndex = 0;

    // If no size fields exist on load, add one.
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('sizesContainer').children.length === 0) {
            addSizeField();
        }
    });

    function addSizeField() {
        const template = `
        <div class="size-entry mb-2 border p-3">
            <div class="row">
                <div class="col-md-3">
                    <input type="text" name="sizes[${sizeIndex}][garment_type]" class="form-control" 
                        placeholder="Garment Type" required>
                </div>
                <div class="col-md-3">
                    <input type="text" name="sizes[${sizeIndex}][size_label]" class="form-control" 
                        placeholder="Size Label" required>
                </div>
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][chest_size]" class="form-control" 
                        placeholder="Chest Size" step="0.1">
                </div>
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][waist]" class="form-control" 
                        placeholder="Waist" step="0.1">
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][hip]" class="form-control" 
                        placeholder="Hip" step="0.1">
                </div>
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][height]" class="form-control" 
                        placeholder="Height" step="0.1">
                </div>
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][length]" class="form-control" 
                        placeholder="Length" step="0.1">
                </div>
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][neck_size]" class="form-control" 
                        placeholder="Neck Size" step="0.1">
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][sleeve_length]" class="form-control" 
                        placeholder="Sleeve Length" step="0.1">
                </div>
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][shoulder_width]" class="form-control" 
                        placeholder="Shoulder Width" step="0.1">
                </div>
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][inseam_length]" class="form-control" 
                        placeholder="Inseam Length" step="0.1">
                </div>
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][leg_opening]" class="form-control" 
                        placeholder="Leg Opening" step="0.1">
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][bust]" class="form-control" 
                        placeholder="Bust" step="0.1">
                </div>
                <div class="col-md-3">
                    <input type="number" name="sizes[${sizeIndex}][waist_to_hem]" class="form-control" 
                        placeholder="Waist to Hem" step="0.1">
                </div>
                <div class="col-md-3">
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeSizeField(this)">Remove</button>
                </div>
            </div>
        </div>`;
        
        document.getElementById('sizesContainer').insertAdjacentHTML('beforeend', template);
        sizeIndex++;
    }

    function removeSizeField(button) {
        button.closest('.size-entry').remove();
    }

    function previewImages() {
        const previewContainer = document.querySelector('.new-images-preview');
        previewContainer.innerHTML = '';

        const files = document.getElementById('item_image').files;
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('image-preview-container');
                const image = document.createElement('img');
                image.classList.add('image-preview');
                image.src = e.target.result;
                imageDiv.appendChild(image);
                previewContainer.appendChild(imageDiv);
            };
            reader.readAsDataURL(file);
        });
    }
</script>

<style>
    .image-preview-container {
        display: inline-block;
        margin: 5px;
    }
    .image-preview {
        height: 100px;
        width: auto;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
</style>
