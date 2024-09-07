<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\ReceiptItem;
use App\Http\Requests\StoreReceiptRequest;
use App\Http\Requests\UpdateReceiptRequest;
use Illuminate\Support\Facades\DB;

class ReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            //code...
            $sql = DB::table("receipts as r")
                ->join('receipt_items as ri', 'r.id', '=', 'ri.receipt_id')
                ->join('users as u', 'r.user_id', '=', 'u.id')
                ->select(
                    'r.id',
                    DB::raw('convert(date,r.created_at) as date'),
                    'r.ref_no',
                    DB::raw('convert(date,r.ref_date) as ref_date'),
                    DB::raw("'Demo' as contact"),
                    'r.remarks',
                    DB::raw('u.name as user')
                );


            //if any conditions
            //$sql->where('u.id','=','1');

            $receipts = $sql->paginate(10);

            return response()->json(['receipts' => $receipts]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReceiptRequest $request)
    {
        $request->validated();
        try {
            //code...
            DB::beginTransaction();
            $masterData = $request->except('receipt_items');
            $detailData = $request->only('receipt_items');
            $master = Receipt::create($masterData);

            foreach ($$detailData as $key => $value) {
                # code...
                ReceiptItem::create([
                    'receipt_id' => $master->id,
                    'cloth_id' => $value['cloth_id'],
                    'color_id' => $value['color_id'],
                    'weight' => $value['weight'],
                    's_no' => $key + 1
                ]);
            }
            DB::commit();
            return response()->json(['message' => 'receipt created successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Receipt $receipt)
    {
        return response()->json(['receipt' => $receipt->load('receipt_items')]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReceiptRequest $request, Receipt $receipt)
    {
        $request->validated();
        try {
            //code...
            DB::beginTransaction();
            $masterData = $request->except('receipt_items');
            $details = $request->only('receipt_items');
            $receipt->update($masterData);
            ReceiptItem::where('receipt_id', $receipt->id)->delete();
            foreach ($details as $key => $value) {
                # code...
                ReceiptItem::create([
                    'receipt_id' => $receipt->id,
                    'cloth_id' => $value['cloth_id'],
                    'color_id' => $value['color_id'],
                    'weight' => $value['weight'],
                    's_no' => $key + 1
                ]);
            }
            DB::commit();
            return response()->json(['message' => 'receipt updated successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Receipt $receipt)
    {
        try {
            //code...
            ReceiptItem::where('receipt_id', $receipt->id)->delete();
            Receipt::where('id', $receipt->id)->delete();
            return response()->json(['message' => 'receipt deleted successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }
}