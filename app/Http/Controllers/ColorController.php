<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Http\Requests\StoreColorRequest;
use App\Http\Requests\UpdateColorRequest;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('all') && $request->has('filter')) {
            $colors = Color::where('active', true)
                ->where('name', 'like', '%' . $request->filter . '%')->get();
        } else if ($request->has('all') && $request->all == 'true') {
            $colors = Color::where('active', true)->get();
        } else {
            $colors = Color::with('user')->paginate(10);
        }
        return response()->json(['colors' => $colors]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreColorRequest $request)
    {
        try {
            //code...
            $data = $request->validated();
            Color::create($data);
            return response()->json(['message' => 'color created successfully',]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Color $color)
    {
        return response()->json(['color' => $color]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateColorRequest $request, Color $color)
    {
        try {
            //code...
            $data =  $request->validated();
            $color->update($data);
            return response()->json(['message' => 'color updated successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Color $color)
    {
        try {
            //code...
            $color->update([
                'active' => !($color->active)
            ]);
            return response()->json(['message' => 'color status updated']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }
}
