<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;

class TeacherController extends Controller
{
    public function index(): JsonResponse
    {
        $data = Teacher::where('featured', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => $data]);
    }

    public function show(string $slug): JsonResponse
    {
        $teacher = Teacher::where('slug', $slug)
            ->with(['reviews' => fn ($q) => $q->where('approved', true)->orderBy('sort_order')])
            ->firstOrFail();

        return response()->json(['data' => $teacher]);
    }
}
