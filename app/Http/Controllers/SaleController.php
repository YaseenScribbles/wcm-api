<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Http\Requests\StoreSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            //code...
            $sql = DB::table("sales as s")
                ->join('sale_items as si', 's.id', '=', 'si.sale_id')
                ->join('users as u', 's.user_id', '=', 'u.id')
                ->join('contacts as c', 'c.id', '=', 's.contact_id')
                ->select(
                    's.id',
                    DB::raw('convert(date,s.created_at) as date'),
                    's.ref_no',
                    DB::raw('convert(date,s.ref_date) as ref_date'),
                    DB::raw("c.name as contact"),
                    's.remarks',
                    DB::raw('u.name as [user]'),
                    DB::raw('sum(si.weight) as weight')
                );


            //if any conditions add them

            $sql->groupBy('s.id', 's.created_at', 's.ref_no', 's.ref_date', 's.remarks', 'u.name', 'c.name');

            $sales = $sql->paginate(10);

            return response()->json(['sales' => $sales]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        $request->validated();
        try {
            //code...
            DB::beginTransaction();
            $masterData = $request->except('sale_items');
            $detailData = $request->sale_items;
            $master = Sale::create($masterData);

            foreach ($detailData as $key => $value) {
                # code...
                SaleItem::create([
                    'sale_id' => $master->id,
                    'cloth_id' => $value['cloth_id'],
                    'color_id' => $value['color_id'],
                    'weight' => $value['weight'],
                    'rate' => $value['rate'],
                    'amount' => $value['amount'],
                    's_no' => $key + 1
                ]);
            }
            DB::commit();
            return response()->json(['message' => 'sale created successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        return response()->json(['sale' => $sale->load('sale_items')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSaleRequest $request, Sale $sale)
    {
        $request->validated();
        try {
            //code...
            DB::beginTransaction();
            $masterData = $request->except('sale_items');
            $details = $request->sale_items;
            $sale->update($masterData);
            SaleItem::where('sale_id', $sale->id)->delete();
            foreach ($details as $key => $value) {
                # code...
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'cloth_id' => $value['cloth_id'],
                    'color_id' => $value['color_id'],
                    'weight' => $value['weight'],
                    'rate' => $value['rate'],
                    'amount' => $value['amount'],
                    's_no' => $key + 1
                ]);
            }
            DB::commit();
            return response()->json(['message' => 'sale updated successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        try {
            //code...
            SaleItem::where('sale_id', $sale->id)->delete();
            Sale::where('id', $sale->id)->delete();
            return response()->json(['message' => 'sale deleted successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    public function stock()
    {
        try {
            //code...
            $stock = DB::table('stock as s')
                ->where('s.weight', '>', 0)
                ->orderBy('cloth_id')
                ->orderBy('color_id')->get();
            return response()->json(['stock' => $stock]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }
}
