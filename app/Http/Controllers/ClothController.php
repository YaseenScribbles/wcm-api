<?php

namespace App\Http\Controllers;

use App\Models\Cloth;
use App\Http\Requests\StoreClothRequest;
use App\Http\Requests\UpdateClothRequest;
use Illuminate\Http\Request;

class ClothController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if($request->has('all')){
            $cloths = Cloth::where('active',true)->get();
        } else {
            $cloths = Cloth::where('active',true)->paginate(10);
        }
        return response()->json(['cloths' => $cloths]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClothRequest $request)
    {
        $data = $request->validated();
        try {
            //code...
            Cloth::create($data);
            return response()->json(['message' => 'cloth created successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Cloth $cloth)
    {
        return response()->json(['cloth' => $cloth]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClothRequest $request, Cloth $cloth)
    {
        try {
            //code...
            $data = $request->validated();
            $cloth->update($data);
            return response()->json(['message' => 'cloth updated successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cloth $cloth)
    {
        try {
            //code...
            $cloth->update([
                'active' => !($cloth->active)
            ]);
            return response()->json(['message' => $cloth->active ? 'cloth suspended' : "cloth activated"]);

        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()],500);
        }
    }
}
