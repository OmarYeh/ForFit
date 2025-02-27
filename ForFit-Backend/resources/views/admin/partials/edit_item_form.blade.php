@php
    $route = route('items.update', $item->id);
    $method = 'PUT';
@endphp

<form method="POST" action="{{ $route }}" enctype="multipart/form-data" id="itemForm">
    @csrf
    @method($method)
    
    <div class="modal-header">
        <h5 class="modal-title">Edit Item</h5>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
    </div>
    
    <div class="modal-body">
        {{-- Hidden ID field (optional if using route-model binding) --}}
        <input type="hidden" name="id" value="{{ $item->id }}">
        
        <!-- Item Name -->
        <div class="form-group">
            <label>Item Name</label>
            <input type="text" class="form-control" name="item_name" value="{{ old('item_name', $item->item_name) }}" required>
        </div>
        
        <!-- Price -->
        <div class="form-group">
            <label>Price</label>
            <input type="number" step="0.01" class="form-control" name="price" value="{{ old('price', $item->price) }}" required>
        </div>
        
        <!-- Rating -->
        <div class="form-group">
            <label>Rating</label>
            <input type="number" step="0.1" min="0" max="5" class="form-control" name="rating" value="{{ old('rating', $item->rating) }}">
        </div>
        
        <!-- Description -->
        <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" name="description" required>{{ old('description', $item->description) }}</textarea>
        </div>
        
        <!-- Currency -->
        <div class="form-group">
            <label>Currency</label>
            <select class="form-control" name="currency_id" required>
                @foreach($currencies as $currency)
                    <option value="{{ $currency->id }}" 
                        {{ old('currency_id', $item->currency_id) == $currency->id ? 'selected' : '' }}>
                        {{ $currency->Currency_code }}
                    </option>
                @endforeach
            </select>
        </div>
        
        <!-- Sizes -->
        <div class="form-group">
            <label>Sizes</label>
            <div id="sizesContainer">
                @if($item->sizes)
                    @foreach($item->sizes as $index => $size)
                        {{-- Assume your partial outputs fields with unique IDs using the provided index.
                             For example, id="garment_type_{{ $index }}" --}}
                        @include('admin.partials.size-fields', ['size' => $size, 'index' => $index])
                    @endforeach
                @endif
            </div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="addSizeField()">Add Size</button>
        </div>
        
        <!-- Existing images -->
        @if ($item->images)
            @foreach ($item->images as $image)
                <div class="image-container" data-image-id="{{ $image->id }}">
                    <img src="{{ Storage::url('items/' . $image->itemimage) }}" class="image-preview">
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeExistingImage({{ $image->id }})">Delete</button>
                    <!-- Hidden input to indicate this image is still present -->
                    <input type="hidden" name="existing_images[]" value="{{ $image->id }}">
                </div>
            @endforeach
        @endif

        <!-- File input to add new images -->
        <div class="form-group">
            <label for="item_image">Add New Image</label>
            <input type="file" name="item_image[]" class="form-control" id="item_image" multiple onchange="previewImages()">
        </div>

        <!-- New Images Preview -->
        <div class="new-images-preview"></div>
        <!-- Container for hidden inputs marking images for deletion -->
        <div id="deletedImagesContainer" style="display: inline;"></div>
        
        <!-- Colors -->
        <div class="form-group">
            <label>Colors</label>
            <select name="colors[]" id="colors" class="form-control" multiple required>
                @foreach($colors as $color)
                    <option value="{{ $color->id }}" 
                        {{ in_array($color->id, old('colors', $item->colors->pluck('id')->toArray())) ? 'selected' : '' }}>
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
                        {{ in_array($category->id, old('cat_ids', $item->categories->pluck('id')->toArray())) ? 'selected' : '' }}>
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
        <button type="submit" class="btn btn-primary">Update</button>
    </div>
</form>

<script>
    // Initialize sizeIndex based on the count of existing sizes.
    let sizeIndex = {{ $item->sizes ? count($item->sizes) : 0 }};

    function addSizeField() {
        // The container for this size field gets a unique id attribute.
        const template = `
        <div class="size-entry mb-2 border p-3" id="size-field-${sizeIndex}">
            <div class="row">
                <div class="col-md-3">
                    <label for="garment_type_${sizeIndex}">Garment Type</label>
                    <input type="text" id="garment_type_${sizeIndex}" name="sizes[${sizeIndex}][garment_type]" class="form-control" placeholder="Garment Type" required>
                </div>
                <div class="col-md-3">
                    <label for="size_label_${sizeIndex}">Size Label</label>
                    <input type="text" id="size_label_${sizeIndex}" name="sizes[${sizeIndex}][size_label]" class="form-control" placeholder="Size Label" required>
                </div>
                <div class="col-md-3">
                    <label for="chest_size_${sizeIndex}">Chest Size</label>
                    <input type="number" id="chest_size_${sizeIndex}" name="sizes[${sizeIndex}][chest_size]" class="form-control" placeholder="Chest Size" step="0.1">
                </div>
                <div class="col-md-3">
                    <label for="waist_${sizeIndex}">Waist</label>
                    <input type="number" id="waist_${sizeIndex}" name="sizes[${sizeIndex}][waist]" class="form-control" placeholder="Waist" step="0.1">
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-3">
                    <label for="hip_${sizeIndex}">Hip</label>
                    <input type="number" id="hip_${sizeIndex}" name="sizes[${sizeIndex}][hip]" class="form-control" placeholder="Hip" step="0.1">
                </div>
                <div class="col-md-3">
                    <label for="height_${sizeIndex}">Height</label>
                    <input type="number" id="height_${sizeIndex}" name="sizes[${sizeIndex}][height]" class="form-control" placeholder="Height" step="0.1">
                </div>
                <div class="col-md-3">
                    <label for="length_${sizeIndex}">Length</label>
                    <input type="number" id="length_${sizeIndex}" name="sizes[${sizeIndex}][length]" class="form-control" placeholder="Length" step="0.1">
                </div>
                <div class="col-md-3">
                    <label for="neck_size_${sizeIndex}">Neck Size</label>
                    <input type="number" id="neck_size_${sizeIndex}" name="sizes[${sizeIndex}][neck_size]" class="form-control" placeholder="Neck Size" step="0.1">
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-3">
                    <label for="sleeve_length_${sizeIndex}">Sleeve Length</label>
                    <input type="number" id="sleeve_length_${sizeIndex}" name="sizes[${sizeIndex}][sleeve_length]" class="form-control" placeholder="Sleeve Length" step="0.1">
                </div>
                <div class="col-md-3">
                    <label for="shoulder_width_${sizeIndex}">Shoulder Width</label>
                    <input type="number" id="shoulder_width_${sizeIndex}" name="sizes[${sizeIndex}][shoulder_width]" class="form-control" placeholder="Shoulder Width" step="0.1">
                </div>
                <div class="col-md-3">
                    <label for="inseam_length_${sizeIndex}">Inseam Length</label>
                    <input type="number" id="inseam_length_${sizeIndex}" name="sizes[${sizeIndex}][inseam_length]" class="form-control" placeholder="Inseam Length" step="0.1">
                </div>
                <div class="col-md-3">
                    <label for="leg_opening_${sizeIndex}">Leg Opening</label>
                    <input type="number" id="leg_opening_${sizeIndex}" name="sizes[${sizeIndex}][leg_opening]" class="form-control" placeholder="Leg Opening" step="0.1">
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-3">
                    <label for="bust_${sizeIndex}">Bust</label>
                    <input type="number" id="bust_${sizeIndex}" name="sizes[${sizeIndex}][bust]" class="form-control" placeholder="Bust" step="0.1">
                </div>
                <div class="col-md-3">
                    <label for="waist_to_hem_${sizeIndex}">Waist to Hem</label>
                    <input type="number" id="waist_to_hem_${sizeIndex}" name="sizes[${sizeIndex}][waist_to_hem]" class="form-control" placeholder="Waist to Hem" step="0.1">
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

    function removeExistingImage(imageId) {
        // Remove the image container visually
        const imageContainer = document.querySelector(`.image-container[data-image-id="${imageId}"]`);
        if (imageContainer) {
            imageContainer.remove();
        }
        // Create a hidden input to mark this image for deletion
        const deleteInput = document.createElement('input');
        deleteInput.type = 'hidden';
        deleteInput.name = 'deleted_images[]';
        deleteInput.value = imageId;
        document.getElementById('deletedImagesContainer').appendChild(deleteInput);
    }
</script>

<style>
    .image-container {
        position: relative;
        display: inline-block;
        margin: 5px;
    }
    .image-preview {
        height: 100px;
        width: auto;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .image-preview-container {
        display: inline-block;
        margin: 5px;
    }
</style>
