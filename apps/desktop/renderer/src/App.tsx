import type { JSX } from "react";
import { RefreshCw, Play } from "lucide-react";
import { AsyncToast } from "./components/AsyncToast";
import { CommandPalette } from "./components/CommandPalette";
import { ConfirmModal } from "./components/ConfirmModal";
import { EvidenceDrawer } from "./components/EvidenceDrawer";
import { InlineError } from "./components/InlineError";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { useTheme } from "./context/ThemeContext";
import { APP_SECTIONS, useCanonkeeperApp } from "./state/useCanonkeeperApp";
import { BibleView } from "./views/BibleView";
import { DashboardView } from "./views/DashboardView";
import { ExportView } from "./views/ExportView";
import { IssuesView } from "./views/IssuesView";
import { ScenesView } from "./views/ScenesView";
import { SearchView } from "./views/SearchView";
import { SettingsView } from "./views/SettingsView";
import { SetupView } from "./views/SetupView";
import { StyleView } from "./views/StyleView";

export function App(): JSX.Element {
  const app = useCanonkeeperApp();
  const { theme, setTheme } = useTheme();

  const commandItems = [
    ...APP_SECTIONS.map((s) => ({ ...s, icon: s.icon })),
    { id: "run.diagnostics", label: "Run Diagnostics", subtitle: "Check IPC, worker, sqlite, and writable state", icon: RefreshCw },
    { id: "jump.issue", label: "Resume Last Issue", subtitle: "Return to last selected issue", icon: Play },
    { id: "jump.entity", label: "Resume Last Entity", subtitle: "Return to last selected entity", icon: Play },
    { id: "jump.scene", label: "Resume Last Scene", subtitle: "Return to last selected scene", icon: Play }
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeSection={app.activeSection}
        onSectionChange={app.setActiveSection}
        collapsed={app.sidebarCollapsed}
        onCollapsedChange={app.setSidebarCollapsed}
        theme={theme}
        onThemeChange={setTheme}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          activeSection={app.activeSection}
          projectName={app.project?.name ?? null}
          status={app.status}
          statusLabel={app.statusLabel}
          onOpenCommandPalette={() => app.setCommandPaletteOpen(true)}
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {app.error ? <InlineError error={app.error} onDismiss={app.clearError} onAction={app.onRunDiagnostics} /> : null}

          <div className="animate-fade-in">
            {app.activeSection === "dashboard" ? (
              <DashboardView
                project={app.project}
                status={app.status}
                processingState={app.processingState}
                history={app.history}
                lastIngest={app.lastIngest}
                continueIssueId={app.continueContext.issueId}
                continueEntityId={app.continueContext.entityId}
                continueSceneId={app.continueContext.sceneId}
                onJumpToIssue={app.onJumpToIssue}
                onJumpToEntity={app.onJumpToEntity}
                onJumpToScene={app.onJumpToScene}
              />
            ) : null}

            {app.activeSection === "setup" ? (
              <SetupView
                busy={app.busy}
                rootPath={app.rootPath}
                docPath={app.docPath}
                healthCheck={app.healthCheck}
                onRootPathChange={app.setRootPath}
                onDocPathChange={app.setDocPath}
                onPickProjectRoot={app.onPickProjectRoot}
                onCreateProject={app.onCreateProject}
                onPickDocument={app.onPickDocument}
                onUseFixture={app.onUseFixture}
                onAddDocument={app.onAddDocument}
                onRunPreflight={app.onRunDiagnostics}
              />
            ) : null}

            {app.activeSection === "search" ? (
              <SearchView
                busy={app.busy}
                searchQuery={app.searchQuery}
                searchResults={app.searchResults}
                questionText={app.questionText}
                askResult={app.askResult}
                onSearchQueryChange={app.setSearchQuery}
                onQuestionTextChange={app.setQuestionText}
                onSearch={app.onSearch}
                onAsk={app.onAsk}
              />
            ) : null}

            {app.activeSection === "scenes" ? (
              <ScenesView
                busy={app.busy}
                scenes={app.scenes}
                selectedSceneId={app.selectedSceneId}
                sceneDetail={app.sceneDetail}
                query={app.sceneQuery}
                onQueryChange={app.setSceneQuery}
                onRefresh={() => void app.refreshScenes()}
                onSelectScene={(sceneId) => void app.onSelectScene(sceneId)}
                onOpenEvidence={(title, detail) => app.onOpenEvidenceFromScene(title, detail)}
              />
            ) : null}

            {app.activeSection === "issues" ? (
              <IssuesView
                busy={app.busy}
                issues={app.issues}
                selectedIssueId={app.selectedIssueId}
                filters={app.issueFilters}
                onFiltersChange={app.setIssueFilters}
                onRefresh={() => void app.refreshIssues()}
                onSelectIssue={app.onSelectIssue}
                onRequestDismiss={app.onRequestDismissIssue}
                onResolve={(issueId) => void app.onResolveIssue(issueId)}
                onOpenEvidence={(title, issue) => app.onOpenEvidenceFromIssue(title, issue)}
              />
            ) : null}

            {app.activeSection === "style" ? (
              <StyleView
                busy={app.busy}
                report={app.styleReport}
                styleIssues={app.styleIssues}
                onRefresh={() => void app.refreshStyle()}
                onOpenIssueEvidence={(title, issue) => app.onOpenEvidenceFromIssue(title, issue)}
                onOpenMetricEvidence={app.openEvidence}
              />
            ) : null}

            {app.activeSection === "bible" ? (
              <BibleView
                busy={app.busy}
                entities={app.entities}
                selectedEntityId={app.selectedEntityId}
                entityDetail={app.entityDetail}
                filters={app.entityFilters}
                onFiltersChange={app.setEntityFilters}
                onRefresh={() => void app.refreshEntities()}
                onSelectEntity={(entityId) => void app.onSelectEntity(entityId)}
                onOpenEvidence={(title, detail) => app.onOpenEvidenceFromClaim(title, detail)}
                onRequestConfirmClaim={app.setConfirmClaimDraft}
              />
            ) : null}

            {app.activeSection === "export" ? (
              <ExportView
                busy={app.busy}
                exportDir={app.exportDir}
                exportKind={app.exportKind}
                lastResult={app.lastExportResult}
                onExportDirChange={app.setExportDir}
                onExportKindChange={app.setExportKind}
                onPickExportDir={app.onPickExportDir}
                onRunExport={app.onRunExport}
              />
            ) : null}

            {app.activeSection === "settings" ? (
              <SettingsView
                status={app.status}
                healthCheck={app.healthCheck}
                onRunDiagnostics={app.onRunDiagnostics}
                theme={theme}
                onThemeChange={setTheme}
                sidebarCollapsed={app.sidebarCollapsed}
                onSidebarCollapsedChange={app.setSidebarCollapsed}
              />
            ) : null}
          </div>
        </main>
      </div>

      <EvidenceDrawer
        open={app.evidenceDrawer.open}
        title={app.evidenceDrawer.title}
        evidence={app.evidenceDrawer.evidence}
        onClose={() => app.setEvidenceDrawer((state) => ({ ...state, open: false }))}
      />

      <CommandPalette
        open={app.commandPaletteOpen}
        items={commandItems}
        onSelect={app.onCommandSelect}
        onClose={() => app.setCommandPaletteOpen(false)}
      />

      <ConfirmModal
        open={Boolean(app.confirmClaimDraft)}
        title="Confirm Canon Claim"
        message="This creates a confirmed claim and supersedes inferred claims for the same field/value pair while preserving evidence links."
        confirmLabel="Confirm Claim"
        onCancel={() => app.setConfirmClaimDraft(null)}
        onConfirm={() => void app.onConfirmClaim()}
      >
        {app.confirmClaimDraft ? (
          <div className="rounded-sm border border-border bg-surface-1 p-2 font-mono text-sm">
            field={app.confirmClaimDraft.field}, evidence={app.confirmClaimDraft.evidenceCount}
          </div>
        ) : null}
      </ConfirmModal>

      <ConfirmModal
        open={Boolean(app.dismissIssueDraft)}
        title="Dismiss Issue"
        message="Enter a reason before dismissing. You can undo within the toast timeout."
        confirmLabel="Dismiss Issue"
        danger
        onCancel={() => app.setDismissIssueDraft(null)}
        onConfirm={() => void app.onConfirmDismissIssue()}
      >
        {app.dismissIssueDraft ? (
          <label className="flex flex-col gap-1 text-sm text-text-secondary">
            Reason
            <textarea
              value={app.dismissIssueDraft.reason}
              onChange={(event) =>
                app.setDismissIssueDraft((current) =>
                  current ? { ...current, reason: event.target.value } : current
                )
              }
              placeholder="Why is this issue being dismissed?"
            />
          </label>
        ) : null}
      </ConfirmModal>

      <AsyncToast toasts={app.toasts} onDismiss={app.dismissToast} />
    </div>
  );
}
