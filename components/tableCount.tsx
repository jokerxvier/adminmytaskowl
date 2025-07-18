'use client';
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { countTableData } from "@/app/api/dashboard-service";

export default function TableCountComponent() {
  const tables = [
    { key: "Attendance", label: "attendance" },
    { key: "Global_work_setting", label: "global_work_settings" },
    { key: "Interest", label: "interest" },
    { key: "Invitation", label: "invitation_codes" },
    { key: "InvitedUsers", label: "invited_users" },
    { key: "JoinRequest", label: "join_requests" },
    { key: "Leave", label: "leaves" },
    { key: "ManualTimeRequest", label: "manual_time_requests" },
    { key: "Notification", label: "notifications" },
    { key: "Organization", label: "organizations" },
    { key: "Project", label: "projects" },
    { key: "Project_has_task", label: "project_has_tasks" },
    { key: "screenshots", label: "screenshots" },
    { key: "Subtask", label: "subtasks" },
    { key: "SuperAdmin", label: "super_admins" },
    { key: "Task_activity", label: "task_activity" },
    { key: "Team", label: "teams" },
    { key: "Team_has_project", label: "team_has_projects" },
    { key: "Team_work_setting", label: "team_work_settings" },
    { key: "Timesheet", label: "timesheets" },
    { key: "User", label: "users" },
    { key: "User_app_setting", label: "user_app_settings" },
    { key: "user_bookmark_links", label: "user_bookmark_links" },
    { key: "User_has_organization", label: "user_has_organizations" },
    { key: "User_has_project", label: "user_has_projects" },
    { key: "User_has_task", label: "user_has_tasks" },
    { key: "User_has_team", label: "user_has_teams" },
    { key: "UserSchedule", label: "user_schedule" },
    { key: "User_setting", label: "user_settings" },
    { key: "User_task_worked", label: "user_task_worked" },
    { key: "User_task_worked_timelog", label: "user_task_worked_timelog" },
    { key: "User_work_setting", label: "user_work_settings" },
    { key: "ViolationReport", label: "violation_reports" },
    { key: "Work_app_site", label: "work_app_sites" }
  ];

  const [count, setCount] = useState<string | number>("...");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col justify-center items-center w-full mt-4 space-y-2">
      <h1 className="text-lg font-semibold">Table Entries Count</h1>
      <div className="w-64">
        <Select
          label="Select a table"
          selectedKeys={selectedKey ? new Set([selectedKey]) : new Set()}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (!selected) return;
            setSelectedKey(String(selected));
            setCount("Loading...");
            countTableData(String(selected))
              .then((data) => setCount(data))
              .catch((err) => {
                console.error("Error:", err);
                setCount("Error");
              });
          }}
        >
          {tables.map((table) => (
            <SelectItem key={table.key}>{table.label}</SelectItem>
          ))}
        </Select>

        <div className="bg-success mt-2 p-3 rounded-xl text-white text-center">
            {selectedKey ? (
                <>
                <div className="text-sm">Entries for <span className="font-medium">{selectedKey}</span>:</div>
                <div className="text-2xl font-bold">{count}</div>
                </>
            ) : (
                <div className="text-sm">Please select a table</div>
            )}
        </div>
      </div>
    </div>
  );
}
