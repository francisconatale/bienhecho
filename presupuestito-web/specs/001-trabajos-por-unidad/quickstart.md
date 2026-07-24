# Quickstart & Validation Guide

## Validating the PDF Generation

1. **Start the local server**:
   ```bash
   cd bien-hecho-web
   npm run dev
   ```

2. **Create a Job and a Task**:
   - Navigate to `/trabajos`.
   - Create a new Job (Trabajo) or open an existing one.
   - Add a new Task (Tarea) to the job.
   - Enter `Cantidad` = 6, `Precio Unitario` = 1000.
   - Verify the form auto-calculates the `Total` = 6000.
   - Save the Task.

3. **Verify UI**:
   - Check the Task item in the list (`task-item.tsx`).
   - It should display the breakdown: "6 x $1.000,00".

4. **Generate the PDF Document**:
   - Click "Generar Presupuesto" or "Ver PDF".
   - Open the generated PDF file.
   - Ensure the budget table now has 4 columns: `Descripción`, `Cant.`, `Precio Unit.`, `Total`.
   - Ensure the new task row correctly aligns and displays the values.

5. **Legacy Data Validation**:
   - Open a Job that has an old task (without `cantidad` in the DB).
   - Ensure it renders successfully in the UI and PDF, showing `Cant.` = 1 and `Precio Unit.` = Total.
