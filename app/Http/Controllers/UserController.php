<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\UserMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::paginate(10);
        return response()->json(['users' => $users]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        try {
            //code...
            User::create($data);
            return response()->json(['message' => 'user created successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json(['user' => $user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        try {
            //code...
            $user->update($data);
            return response()->json(['message' => 'user updated successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            //code...
            $user->update([
                'active' => !($user->active)
            ]);
            return response()->json(['message' => 'user status updated']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()]);
        }
    }

    public function menus(int $id)
    {
        try {
            //code...
            $menus = DB::table('menu_list as m')
                ->where('active', true)
                ->select('m.id', 'm.name')
                ->get();
            $user_menus = DB::table('user_menus as um')
                ->join('users as u', 'u.id', '=', 'um.user_id')
                ->join('menu_list as ml', 'ml.id', '=', 'um.menu_id')
                ->where('u.id', $id)
                ->select('ml.id', 'ml.name')
                ->get();

            return response()->json(['menus' => $menus, 'user_menus' => $user_menus]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }

    public function user_menus(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'menu_ids' => 'array',
            'menu_ids.*' => 'exists:menu_list,id'
        ]);

        try {
            //code...
            UserMenu::where('user_id', $request->user_id)->delete();
            foreach ($request->menu_ids as $menu_id) {
                UserMenu::create([
                    'user_id' => $request->user_id,
                    'menu_id' => $menu_id
                ]);
            }

            return response()->json(['message' => 'user updated successfully']);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }
}
