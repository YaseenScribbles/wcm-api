<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContactRequest extends FormRequest
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
            'name' => 'required|string|unique:contacts,name,' . $this->route('contact.id'),
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'pincode' => 'nullable|string',
            'phone' => 'nullable|string',
            'gst' => 'nullable|string|size:15|unique:contacts,gst,' . $this->route('contact.id'),
            'active' => 'boolean',
            'user_id' => 'required|exists:users,id'
        ];
    }
}
