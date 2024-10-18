<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $sql = DB::table("stock as s")
            ->join('cloths as c', 'c.id', '=', 's.cloth_id')
            ->join('colors as col', 'col.id', '=', 's.color_id')
            ->select(
                DB::raw('c.name as cloth'),
                DB::raw('col.name as color'),
                's.weight'
            )
            ->where('s.weight', '>', 0)
            ->orderBy('c.name')
            ->orderBy('col.name');

        if ($request->has('all')) {
            $stock = $sql->get();
        } else {
            $stock = $sql->paginate(10);
        }

        return response()->json(['stock' => $stock]);
    }


    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        try {
            //code...
            $masterSql = "select s.id [no], s.created_at [date], s.remarks, c.name , c.address , c.city, c.pincode, c.phone, c.gst
            from sales s
            inner join contacts c on s.contact_id = c.id
            where s.id =" . $id;
            $sale = DB::select($masterSql);

            $detailsSql = "select si.s_no,cl.name [cloth], co.name [color], si.actual_weight, si.rate, si.amount
            from sale_items si
            inner join cloths cl on cl.id = si.cloth_id
            inner join colors co on co.id = si.color_id
            where si.sale_id = " . $id;
            $saleItems = DB::select($detailsSql);

            return response()->json(['sale' => $sale[0], 'saleItems' => $saleItems]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()]);
        }
    }
}
