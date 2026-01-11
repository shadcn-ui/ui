import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();

    try {
      const query = `
        SELECT 
          d.*,
          u.first_name as manager_first_name,
          u.last_name as manager_last_name,
          parent.name as parent_department_name,
          COUNT(DISTINCT e.id) as employee_count
        FROM departments d
        LEFT JOIN users u ON d.manager_id = u.id
        LEFT JOIN departments parent ON d.parent_department_id = parent.id
        LEFT JOIN employees e ON e.department_id = d.id
        GROUP BY d.id, u.first_name, u.last_name, parent.name
        ORDER BY d.name ASC
      `;

      const result = await client.query(query);

      const departments = result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        code: row.code,
        description: row.description,
        parent_department_id: row.parent_department_id,
        parent_department_name: row.parent_department_name,
        manager_id: row.manager_id,
        manager: row.manager_id
          ? {
              first_name: row.manager_first_name,
              last_name: row.manager_last_name,
            }
          : null,
        budget: parseFloat(row.budget || 0),
        employee_count: parseInt(row.employee_count || 0),
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

      return NextResponse.json({ departments });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, description, parent_department_id, manager_id, budget } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `INSERT INTO departments 
          (name, code, description, parent_department_id, manager_id, budget, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING *`,
        [
          name,
          code,
          description || null,
          parent_department_id || null,
          manager_id || null,
          budget || 0,
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json(
        {
          message: "Department created successfully",
          department: result.rows[0],
        },
        { status: 201 }
      );
    } catch (error: any) {
      await client.query("ROLLBACK");
      
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Department code already exists" },
          { status: 400 }
        );
      }
      
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}
