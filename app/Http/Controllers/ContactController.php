<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request )
    {
        if($request->has('all') && $request->all == 'true'){
            $contacts = Contact::where('active',true)->get();
        } else {
            $contacts = Contact::with('user')->paginate(10);
        }
        return response()->json(['contacts' => $contacts]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactRequest $request)
    {
        $data = $request->validated();
        try {
            //code...
            Contact::create($data);
            return response()->json(['message' => 'contact created successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        return response()->json(['contact' => $contact]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactRequest $request, Contact $contact)
    {
        $data = $request->validated();
        try {
            //code...
            $contact->update($data);
            return response()->json(['message' => 'contact updated successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        try {
            //code...
            $contact->update([
                'active' => !($contact->active)
            ]);
            return response()->json(['message' => 'contact status updated']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()],500);
        }
    }
}
