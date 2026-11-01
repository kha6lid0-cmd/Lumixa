import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { WorkspaceA11yProvider, WorkspaceA11yStatus } from '../context/WorkspaceA11yContext';
import { TOOLS_CATALOG, UI_STRINGS } from '../data/translations';
import { Language, ToolCategory, ToolDefinition, ToolId } from '../types/tools';
import { AdSlot } from './AdSlot';
import { Breadcrumb } from './Breadcrumb';
import { ToolIcon } from './ToolIcon';
import { ArabicTextCleanerTool } from './tools/ArabicTextCleanerTool';
import { Base64ConverterTool } from './tools/Base64ConverterTool';
import { ImageCompressorTool } from './tools/ImageCompressorTool';
import { ImageConverterTool } from './tools/ImageConverterTool';
import { ImageResizerTool } from './tools/ImageResizerTool';
import { ImagesToPdfTool } from './tools/ImagesToPdfTool';
import { JsonFormatterTool } from './tools/JsonFormatterTool';
import { PasswordGeneratorTool } from './tools/PasswordGeneratorTool';
import { PdfCompressorTool } from './tools/PdfCompressorTool';
import { PdfMergerTool } from './tools/PdfMergerTool';
import { PdfSplitterTool } from './tools/PdfSplitterTool';
import { PdfToImagesTool } from './tools/PdfToImagesTool';
import { QrGeneratorTool } from './tools/QrGeneratorTool';
import { TextDiffTool } from './tools/TextDiffTool';
import { TextFormatterTool } from './tools/TextFormatterTool';
import { TimestampConverterTool } from './tools/TimestampConverterTool';
import { WordCounterTool } from './tools/WordCounterTool';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  lang: Language;
  onNavigateHome: () => void;
  onNavigateCategory: (category: ToolCategory) => void;
  onSelectTool: (id: ToolId) => void;
}

const FILE_BASED_TOOLS = new Set<ToolId>([
  ToolId.IMAGE_COMPRESSOR,
  ToolId.IMAGE_RESIZER,
  ToolId.IMAGE_CONVERTER,
  ToolId.IMAGES_TO_PDF,
  ToolId.PDF_MERGER,
  ToolId.PDF_SPLITTER,
  ToolId.PDF_TO_IMAGES,
  ToolId.PDF_COMPRESSOR,
  ToolId.BASE64_CONVERTER,
]);

export function ToolWorkspace({
  tool,
  lang,
  onNavigateHome,
  onNavigateCategory,
  onSelectTool,
}: ToolWorkspaceProps) {
  const isAr = lang === Language.AR;
  const t = UI_STRINGS[lang];
  const content = tool[lang];
  const categoryLabel = t.categories[tool.category];

  const defaultStatus = useMemo<WorkspaceA11yStatus>(() => {
    const usesFiles = FILE_BASED_TOOLS.has(tool.id);
    return {
      fileStatus: usesFiles
        ? isAr
          ? 'لم يتم اختيار ملف'
          : 'No file selected'
        : isAr
        ? 'الأداة جاهزة للإدخال'
        : 'Tool ready for input',
      actionStatus: '',
      isBusy: false,
    };
  }, [tool.id, isAr]);

  const [a11yStatus, setA11yStatus] = useState<WorkspaceA11yStatus>(defaultStatus);
  const [isShowingProgress, setIsShowingProgress] = useState(false);
  const [busyLabel, setBusyLabel] = useState<string>(
    isAr ? 'جاري المعالجة...' : 'Processing...'
  );

  useEffect(() => {
    setA11yStatus(defaultStatus);
    setIsShowingProgress(false);
    setBusyLabel(isAr ? 'جاري المعالجة...' : 'Processing...');
  }, [defaultStatus, isAr]);

  useEffect(() => {
    if (a11yStatus.isBusy) {
      setIsShowingProgress(true);
      setBusyLabel(
        a11yStatus.actionStatus || (isAr ? 'جاري المعالجة...' : 'Processing...')
      );
      return;
    }

    const settleTimer = window.setTimeout(() => {
      setIsShowingProgress(false);
    }, 280);

    return () => window.clearTimeout(settleTimer);
  }, [a11yStatus.isBusy, a11yStatus.actionStatus, isAr]);

  useEffect(() => {
    if (!a11yStatus.isBusy) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = isAr
        ? 'تتم معالجة ملفاتك الآن. هل تريد مغادرة الصفحة؟'
        : 'Your files are still processing. Are you sure you want to leave?';
      return event.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [a11yStatus.isBusy, isAr]);

  const reportStatus = useCallback((next: WorkspaceA11yStatus) => {
    setA11yStatus((prev) => {
      if (
        prev.fileStatus === next.fileStatus &&
        prev.actionStatus === next.actionStatus &&
        prev.isBusy === next.isBusy &&
        prev.progress === next.progress
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  const contextValue = useMemo(() => ({ reportStatus }), [reportStatus]);

  const relatedTools = TOOLS_CATALOG.filter((item) => item.id !== tool.id)
    .sort((a, b) => (a.category === tool.category ? -1 : b.category === tool.category ? 1 : 0))
    .slice(0, 3);

  const renderActiveTool = () => {
    switch (tool.id) {
      case ToolId.IMAGE_COMPRESSOR:
        return <ImageCompressorTool lang={lang} />;
      case ToolId.IMAGE_RESIZER:
        return <ImageResizerTool lang={lang} />;
      case ToolId.IMAGE_CONVERTER:
        return <ImageConverterTool lang={lang} />;
      case ToolId.IMAGES_TO_PDF:
        return <ImagesToPdfTool lang={lang} />;
      case ToolId.QR_GENERATOR:
        return <QrGeneratorTool lang={lang} />;
      case ToolId.PDF_MERGER:
        return <PdfMergerTool lang={lang} />;
      case ToolId.PDF_SPLITTER:
        return <PdfSplitterTool lang={lang} />;
      case ToolId.PDF_TO_IMAGES:
        return <PdfToImagesTool lang={lang} />;
      case ToolId.PDF_COMPRESSOR:
        return <PdfCompressorTool lang={lang} />;
      case ToolId.WORD_COUNTER:
        return <WordCounterTool lang={lang} />;
      case ToolId.TEXT_FORMATTER:
        return <TextFormatterTool lang={lang} />;
      case ToolId.JSON_FORMATTER:
        return <JsonFormatterTool lang={lang} />;
      case ToolId.PASSWORD_GENERATOR:
        return <PasswordGeneratorTool lang={lang} />;
      case ToolId.BASE64_CONVERTER:
        return <Base64ConverterTool lang={lang} />;
      case ToolId.TEXT_DIFF:
        return <TextDiffTool lang={lang} />;
      case ToolId.ARABIC_TEXT_CLEANER:
        return <ArabicTextCleanerTool lang={lang} />;
      case ToolId.TIMESTAMP_CONVERTER:
        return <TimestampConverterTool lang={lang} />;
    }
  };

  const liveAnnouncement = a11yStatus.actionStatus
    ? `${a11yStatus.fileStatus}. ${a11yStatus.actionStatus}`
    : a11yStatus.fileStatus;

  return (
    <div className="w-full">
      {/* Persistent Top Breadcrumb Navigation Bar */}
      <Breadcrumb
        tool={tool}
        lang={lang}
        onNavigateHome={onNavigateHome}
        onNavigateCategory={onNavigateCategory}
        onSelectTool={onSelectTool}
      />

      <article className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-10">
        {/* Polite Screen-Reader Status Announcer */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {`${content.name}: ${liveAnnouncement}`}
        </div>

        {/* Tool Header */}
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{content.formatsLabel}</span>
          </div>

          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
              <ToolIcon name={tool.iconName} className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 break-words">
                {content.name}
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                {content.shortDescription}
              </p>
            </div>
          </div>
        </header>

        {/* Interactive Tool Surface */}
        <section
          aria-label={`${content.name} — ${liveAnnouncement}`}
          aria-busy={Boolean(a11yStatus.isBusy)}
          className="lumixa-tool-surface relative overflow-hidden bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-8"
        >
          {/* Top-edge progress bar (determinate when a tool reports progress) */}
          <div
            role="progressbar"
            aria-label={busyLabel}
            aria-busy={isShowingProgress}
            aria-valuemin={a11yStatus.progress === undefined ? undefined : 0}
            aria-valuemax={a11yStatus.progress === undefined ? undefined : 100}
            aria-valuenow={a11yStatus.progress === undefined ? undefined : a11yStatus.progress}
            aria-hidden={!isShowingProgress}
            className={`pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden bg-violet-100/80 transition-opacity duration-200 ${
              isShowingProgress ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className={`h-full rounded-full bg-gradient-to-r from-violet-500 via-violet-700 to-violet-500 ${
                a11yStatus.progress === undefined ? 'w-2/5 animate-lumixa-indeterminate' : ''
              }`}
              style={a11yStatus.progress === undefined ? undefined : { width: `${a11yStatus.progress}%` }}
            />
          </div>

          <WorkspaceA11yProvider value={contextValue}>
            {renderActiveTool()}
          </WorkspaceA11yProvider>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-700 shrink-0" aria-hidden="true" />
              <span>{t.workspace.privacyNotice}</span>
            </div>

            <div
              aria-hidden={!isShowingProgress}
              className={`inline-flex items-center gap-1.5 font-medium text-violet-700 transition-opacity duration-200 ${
                isShowingProgress ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'
              }`}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
              <span>{busyLabel}{a11yStatus.progress !== undefined ? ` · ${a11yStatus.progress}%` : ''}</span>
            </div>
          </div>
        </section>

        {/* Step-by-Step Instructions for Users & SEO */}
        <section aria-labelledby="how-to-heading" className="pt-2">
          <h2 id="how-to-heading" className="text-lg font-bold text-slate-900 mb-5">
            {t.workspace.howToTitle}
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.steps.map((step, idx) => (
              <li
                key={idx}
                className="p-5 rounded-xl border border-slate-200/80 bg-white space-y-2"
              >
                <span className="text-xs font-mono tabular-nums font-bold text-violet-700">
                  0{idx + 1}.
                </span>
                <p className="text-sm leading-relaxed text-slate-700">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Reserved Non-Intrusive Ad Space */}
        <AdSlot lang={lang} slotKey="toolWorkspaceBottom" />

        {/* Related Tools */}
        <section aria-labelledby="related-heading" className="pt-4 border-t border-slate-200/80">
          <h2 id="related-heading" className="text-lg font-bold text-slate-900 mb-5">
            {t.workspace.relatedToolsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedTools.map((rel) => {
              const relContent = rel[lang];
              return (
                <a
                  key={rel.id}
                  href={`#/tool/${rel.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTool(rel.id);
                  }}
                  className="group p-5 rounded-xl border border-slate-200/90 bg-white hover:border-violet-400 transition-colors flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500">
                        {t.categories[rel.category]} · {relContent.formatsLabel}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                      {relContent.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {relContent.shortDescription}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700">
                    <span>{isAr ? 'فتح الأداة' : 'Open Tool'}</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 rtl:rotate-180 transition-transform duration-150 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </article>
    </div>
  );
}
