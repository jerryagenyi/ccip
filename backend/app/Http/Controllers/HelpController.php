<?php

namespace App\Http\Controllers;

use App\Models\HelpArticle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HelpController extends Controller
{
    public function articles(Request $request)
    {
        $user = $request->user();
        $query = HelpArticle::where('is_published', true);

        // Filter by role access
        $query->where(function ($q) use ($user) {
            $q->whereNull('role_access')
                ->orWhereJsonContains('role_access', $user->role);
        });

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $perPage = $request->get('per_page', 20);
        $articles = $query->latest()->paginate($perPage);

        return $this->paginated($articles, 'Articles retrieved successfully');
    }

    public function article($id)
    {
        $user = request()->user();

        // Try to find by ID or slug
        $article = HelpArticle::where(function ($q) use ($id) {
            $q->where('id', $id)
                ->orWhere('slug', $id);
        })
            ->where('is_published', true)
            ->where(function ($q) use ($user) {
                $q->whereNull('role_access')
                    ->orWhereJsonContains('role_access', $user->role);
            })
            ->firstOrFail();

        // Increment views
        $article->increment('views');

        return $this->success($article, 'Article retrieved successfully');
    }

    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2',
        ]);

        $user = $request->user();
        $query = $request->q;

        $articles = HelpArticle::where('is_published', true)
            ->where(function ($q) use ($user) {
                $q->whereNull('role_access')
                    ->orWhereJsonContains('role_access', $user->role);
            })
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', '%'.$query.'%')
                    ->orWhere('content', 'like', '%'.$query.'%')
                    ->orWhere('excerpt', 'like', '%'.$query.'%');
            })
            ->limit(20)
            ->get();

        return $this->success($articles, 'Search results retrieved');
    }

    public function categories(Request $request)
    {
        $user = $request->user();

        $categories = HelpArticle::where('is_published', true)
            ->where(function ($q) use ($user) {
                $q->whereNull('role_access')
                    ->orWhereJsonContains('role_access', $user->role);
            })
            ->select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->category,
                    'count' => $item->count,
                ];
            });

        return $this->success($categories, 'Categories retrieved successfully');
    }
}
