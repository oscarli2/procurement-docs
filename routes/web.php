<?php
use App\Http\Controllers\Admin\UserAdminController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\MarketAnalysisController;
use App\Http\Controllers\PpmpController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RfqController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/test', function () {
    return 'Hello';
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/users', [UserAdminController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserAdminController::class, 'create'])->name('users.create');
    Route::post('/users', [UserAdminController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserAdminController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserAdminController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/toggle-admin', [UserAdminController::class, 'toggleAdmin'])->name('users.toggle-admin');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/create-pr', [PurchaseRequestController::class, 'create']);
    Route::get('/mas/create', [MarketAnalysisController::class, 'create']);
    Route::get('/mas', [MarketAnalysisController::class, 'index']);
    Route::get('/mas/completed', [MarketAnalysisController::class, 'completed']);
    Route::post('/mas', [MarketAnalysisController::class, 'store']);
    Route::get('/mas/{id}/edit', [MarketAnalysisController::class, 'edit']);
    Route::put('/mas/{id}', [MarketAnalysisController::class, 'update']);
    Route::delete('/mas/{id}', [MarketAnalysisController::class, 'destroy']);
    Route::get('/download-ma/{id}', [MarketAnalysisController::class, 'download']);
    Route::get('/prs', [PurchaseRequestController::class, 'index']);
    Route::get('/prs/{id}/edit', [PurchaseRequestController::class, 'edit']);
    Route::put('/prs/{id}', [PurchaseRequestController::class, 'update'])->name('pr.update');
    Route::delete('/prs/{id}', [PurchaseRequestController::class, 'destroy'])->name('pr.destroy');
    Route::post('/store-pr', [PurchaseRequestController::class, 'store']);
    Route::get('/download-pr/{id}', [PurchaseRequestController::class, 'download']);

    Route::get('/create-rfq', [RfqController::class, 'create']);
    Route::get('/rfqs', [RfqController::class, 'index']);
    Route::post('/store-rfq', [RfqController::class, 'store']);
    Route::get('/download-rfq/{id}', [RfqController::class, 'download']);
    Route::delete('/rfqs/{id}', [RfqController::class, 'destroy'])->name('rfq.destroy');

    Route::get('/ppmps', [PpmpController::class, 'index']);
    Route::get('/download-ppmp-demo', [PpmpController::class, 'downloadDemo']);
    Route::get('/create-ppmp', [PpmpController::class, 'create']);
    Route::get('/ppmps/{id}/edit', [PpmpController::class, 'edit']);
    Route::put('/ppmps/{id}', [PpmpController::class, 'update'])->name('ppmp.update');
    Route::delete('/ppmps/{id}', [PpmpController::class, 'destroy'])->name('ppmp.destroy');
    Route::post('/ppmps', [PpmpController::class, 'store'])->name('ppmp.store');
    Route::get('/ppmps/{id}/download', [PpmpController::class, 'download'])->name('ppmp.download');
});

require __DIR__.'/auth.php';