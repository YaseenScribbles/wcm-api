<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|confirmed',
            'role' => 'string|nullable'
        ]);

        try {
            //code...
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => $request->role
            ]);
            return response()->json(['message' => 'user registered successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required'
        ]);

        try {
            //code...
            if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                $sql = "select ml.name,ur.edit, ur.[delete]
                from user_menus um
                inner join user_rights ur on um.user_id = ur.user_id and um.menu_id = ur.menu_id
                inner join menu_list ml on um.menu_id = ml.id
                where um.user_id = " . Auth::user()->id;
                $user_menus = DB::select($sql);
                return response()->json(['message' => 'login success', 'user' => Auth::user(), 'user_menus' => $user_menus]);
            } else {
                return response()->json(['message' => 'enter valid credentials'], 400);
            }
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }
}
