<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TeacherResource;
use App\Models\Teacher;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TeacherController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $data = Teacher::where('featured', true)
            ->orderBy('sort_order')
            ->get();

        return TeacherResource::collection($data);
    }

    public function show(string $slug): TeacherResource
    {
        $teacher = Teacher::where('slug', $slug)
            ->with(['reviews' => fn ($q) => $q->where('approved', true)->orderBy('sort_order')])
            ->firstOrFail();

        return new TeacherResource($teacher);
    }
}
