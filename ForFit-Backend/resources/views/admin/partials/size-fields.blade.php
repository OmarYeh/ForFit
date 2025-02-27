<div class="size-entry mb-2 border p-3">
    <div class="row">
        <div class="col-md-3">
            <input type="text" name="sizes[{{ $index }}][garment_type]" class="form-control" 
                placeholder="Garment Type" value="{{ $size->garment_type }}" required>
        </div>
        <div class="col-md-3">
            <input type="text" name="sizes[{{ $index }}][size_label]" class="form-control" 
                placeholder="Size Label" value="{{ $size->size_label }}" required>
        </div>
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][chest_size]" class="form-control" 
                placeholder="Chest Size" value="{{ $size->chest_size }}" step="0.1">
        </div>
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][waist]" class="form-control" 
                placeholder="Waist" value="{{ $size->waist }}" step="0.1">
        </div>
    </div>
    <div class="row mt-2">
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][hip]" class="form-control" 
                placeholder="Hip" value="{{ $size->hip }}" step="0.1">
        </div>
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][height]" class="form-control" 
                placeholder="Height" value="{{ $size->height }}" step="0.1">
        </div>
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][length]" class="form-control" 
                placeholder="Length" value="{{ $size->length }}" step="0.1">
        </div>
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][neck_size]" class="form-control" 
                placeholder="Neck Size" value="{{ $size->neck_size }}" step="0.1">
        </div>
    </div>
    <div class="row mt-2">
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][sleeve_length]" class="form-control" 
                placeholder="Sleeve Length" value="{{ $size->sleeve_length }}" step="0.1">
        </div>
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][shoulder_width]" class="form-control" 
                placeholder="Shoulder Width" value="{{ $size->shoulder_width }}" step="0.1">
        </div>
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][inseam_length]" class="form-control" 
                placeholder="Inseam Length" value="{{ $size->inseam_length }}" step="0.1">
        </div>
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][leg_opening]" class="form-control" 
                placeholder="Leg Opening" value="{{ $size->leg_opening }}" step="0.1">
        </div>
    </div>
    <div class="row mt-2">
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][bust]" class="form-control" 
                placeholder="Bust" value="{{ $size->bust }}" step="0.1">
        </div>
        <div class="col-md-3">
            <input type="number" name="sizes[{{ $index }}][waist_to_hem]" class="form-control" 
                placeholder="Waist to Hem" value="{{ $size->waist_to_hem }}" step="0.1">
        </div>
        <div class="col-md-3">
            <button type="button" class="btn btn-danger btn-sm" onclick="removeSizeField(this)">Remove</button>
        </div>
    </div>
</div>