<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskStoreRequest;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    /**
     * Returns the tasks ordered by order.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // return tasks ordered by order
        $tasks = Task::query()
            ->orderBy('order')
            ->select('id', 'name', 'order')
            ->get();

        return response()->json($tasks);
    }

    /**
     * Creates a new task.
     * @param TaskStoreRequest $request
     * @param Task $task
     * @return JsonResponse
     */
    public function store(TaskStoreRequest $request): JsonResponse
    {
        $existing_task = Task::query()
            ->withTrashed()
            ->where('name', $request->input('name'))
            ->first();

        if ($existing_task) {
            if ($existing_task->deleted_at) {
                $existing_task->restore();
                $existing_task->order = Task::max('order') + 1;
                $existing_task->save();

                return response()->json($existing_task);
            }

            return response()->json('Task already exists', 422);
        }

        $task = new Task();
        $task->name = $request->input('name');
        $task->order = Task::max('order') + 1;
        $task->save();

        return response()->json($task);
    }

    /**
     * Updates a task.
     *
     * @param TaskStoreRequest $request
     * @param Task $task
     * @return JsonResponse
     */
    public function update(TaskStoreRequest $request, Task $task): JsonResponse
    {
        $task->update($request->validated());

        return response()->json($task);
    }

    /**
     * Deletes a task.
     *
     * @param Task $task
     * @return JsonResponse
     */
    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        return response()->json(null);
    }

    /**
     * Moves a task up or down.
     *
     * @return JsonResponse
     */
    public function moveUp(Task $task): JsonResponse
    {
        $current_order = $task->order;

        $previous_task = Task::query()
            ->where('order', '<', $current_order)
            ->orderBy('order', 'desc')
            ->first();

        if ($previous_task) {
            $task->order = $previous_task->order;
            $task->save();

            $previous_task->order = $current_order;
            $previous_task->save();
        } else {
            $task->order = 1;
            $task->save();
        }

        return response()->json($task);
    }

    /**
     * Moves a task up or down.
     *
     * @return JsonResponse
     */
    public function moveDown(Task $task): JsonResponse
    {
        $current_order = $task->order;

        $next_task = Task::query()
            ->where('order', '>', $current_order)
            ->orderBy('order')
            ->first();

        if ($next_task) {
            $task->order = $next_task->order;
            $task->save();

            $next_task->order = $current_order;
            $next_task->save();
        } else {
            $task->order = Task::max('order') + 1;
            $task->save();
        }

        return response()->json($task);
    }
}
