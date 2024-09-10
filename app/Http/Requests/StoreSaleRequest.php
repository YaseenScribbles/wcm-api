<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ref_no' => 'required|string',
            'ref_date' => 'required|date',
            'contact_id' => 'required|integer',
            'remarks' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'sale_items' => 'required|array',
            'sale_items.*.cloth_id' => 'required|integer|exists:cloths,id',
            'sale_items.*.color_id' => 'required|integer|exists:colors,id',
            'sale_items.*.weight' => 'required|numeric',
        ];
    }
}
