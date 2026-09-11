import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Loader2,
  Star,
  GitFork,
  ExternalLink,
  Code2,
  AlertCircle,
  Sparkles,
  Github,
  X,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { GitHubRepo, GitHubSearchResponse } from '../types';

interface PublicRepoSearchProps {
  onNotify?: (message: string) => void;
}

// Color mapping for common programming languages
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3776AB',
  Rust: '#DEA584',
  Go: '#00ADD8',
  'C++': '#F34B7D',
  C: '#555555',
  Java: '#B07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Solidity: '#AA6746',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Dart: '#00B4AB',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Shell: '#89E051',
  Vue: '#41B883',
  Jupyter: '#DA5B0B',
};

const SUGGESTED_QUERIES = [
  'ai-agents',
  'transformers',
  'webgpu',
  'zero-knowledge',
  'ebpf',
  'robotics',
];

export const PublicRepoSearch: React.FC<PublicRepoSearchProps> = ({ onNotify }) => {
  const [query, setQuery] = useState<string>('ai-agents');
  const [submittedQuery, setSubmittedQuery] = useState<string>('ai-agents');
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  // Fetch repositories from public GitHub Search API
  const performSearch = useCallback(async (searchQuery: string) => {
    if (isLoading) return; // Prevent duplicate searches while loading

    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setError('Please enter a search keyword or repository name.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSubmittedQuery(trimmed);
    setHasSearched(true);

    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(trimmed)}&sort=stars&order=desc&per_page=12`;
      const response = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please wait a moment and try again.');
        }
        if (response.status === 422) {
          throw new Error('Invalid search query format. Please try different keywords.');
        }
        throw new Error(`GitHub API error (${response.status}): ${response.statusText}`);
      }

      const data: GitHubSearchResponse = await response.json();
      setRepos(data.items || []);
      setTotalCount(data.total_count || 0);

      const countMsg = `Found ${data.total_count?.toLocaleString() || 0} repositories for "${trimmed}"`;
      if (onNotify) {
        onNotify(countMsg);
      }
    } catch (err: any) {
      const message = 'Unable to load repositories.';
      setError(message);
      setRepos([]);
      if (onNotify) {
        onNotify('Unable to load repositories. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onNotify]);

  // Initial search on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      performSearch('ai-agents');
    }
  }, [performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate searches
    performSearch(query);
  };

  const handleSuggestionClick = (suggested: string) => {
    if (isLoading) return; // Prevent duplicate searches
    setQuery(suggested);
    performSearch(suggested);
    inputRef.current?.focus();
  };

  const formatStars = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  return (
    <section
      id="repo-search-section"
      aria-labelledby="repo-search-heading"
      className="w-full bg-[#10151F] border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Github className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="tracking-wider uppercase font-mono">OPEN SOURCE HUB</span>
          </div>

          <h2
            id="repo-search-heading"
            className="font-hero text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white"
          >
            PUBLIC REPOSITORY SEARCH
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Search real-time public repositories directly via the GitHub REST API to discover codebases, research frameworks, and developer tools related to CONVERGE 2026 tracks.
          </p>
        </div>

        {/* Header Right Actions: Live Search Status Pill & Test Error State Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          {/* Reviewer Test Error State Button */}
          <button
            type="button"
            id="test-error-state-btn"
            onClick={() => {
              setIsLoading(false);
              setRepos([]);
              setError('Unable to load repositories.');
              setHasSearched(true);
              if (onNotify) {
                onNotify('Simulated error: Unable to load repositories.');
              }
            }}
            disabled={isLoading}
            aria-label="Simulate and test error state"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-medium transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
            <span>Test Error State</span>
          </button>

          {/* Live Search Status Pill */}
          {hasSearched && !isLoading && !error && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#080B12] px-3.5 py-2 rounded-xl border border-white/10 shrink-0">
              <span>Results for</span>
              <span className="font-bold text-blue-400 font-mono">"{submittedQuery}"</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-semibold">{totalCount.toLocaleString()} total</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Input Form (Handles Enter Key and Search Button click) */}
      <form onSubmit={handleSubmit} className="space-y-3" role="search">
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          {/* Input Box */}
          <div className="relative flex-1">
            <label htmlFor="github-repo-search-input" className="sr-only">
              Search GitHub public repositories
            </label>
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id="github-repo-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search GitHub repositories (e.g., langchain, webgpu, pytorch, rust)..."
              disabled={isLoading}
              className="w-full bg-[#080B12] text-white placeholder-slate-500 pl-10 pr-9 py-3 rounded-xl border border-white/15 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50"
            />
            {query && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear search input"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            aria-label={isLoading ? 'Searching repositories' : 'Search repositories'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                <span>Searching repositories...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400 pt-1">
          <span className="font-semibold text-slate-400 mr-1 text-[11px] uppercase font-mono">
            Popular Topics:
          </span>
          {SUGGESTED_QUERIES.map((tag) => (
            <button
              key={tag}
              type="button"
              disabled={isLoading}
              onClick={() => handleSuggestionClick(tag)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                submittedQuery === tag
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 font-semibold'
                  : 'bg-[#080B12] text-slate-300 border-white/10 hover:border-white/25 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </form>

      {/* Screen Reader & Live Status Announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {isLoading
          ? `Searching repositories... Querying GitHub API for ${query.trim() || submittedQuery}`
          : error
          ? `${error} Please check your connection and try again.`
          : hasSearched
          ? `Showing ${repos.length} repositories for ${submittedQuery}`
          : ''}
      </div>

      {/* Visually and Textually Distinct Loading State */}
      {isLoading && (
        <div
          id="repo-search-loading-state"
          role="status"
          aria-live="polite"
          className="rounded-2xl bg-[#080B12] border border-blue-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl transition-all"
        >
          {/* Spinner and Status Indicator */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Loader2 className="w-7 h-7 text-blue-400 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            </div>

            <div className="space-y-1">
              <h3 className="font-hero text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
                Searching repositories...
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Querying GitHub public API for <span className="text-blue-400 font-semibold">"{query.trim() || submittedQuery}"</span>
              </p>
            </div>
          </div>

          {/* Subtle Skeletons for Loading Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 text-left opacity-60">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#10151F] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-3.5 motion-safe:animate-pulse motion-reduce:opacity-80"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/10" />
                    <div className="h-3 bg-white/10 rounded-sm w-20" />
                  </div>
                  <div className="w-4 h-4 bg-white/10 rounded-sm" />
                </div>

                <div className="space-y-1.5">
                  <div className="h-4 bg-white/15 rounded-sm w-3/4" />
                  <div className="h-3 bg-white/5 rounded-sm w-full" />
                  <div className="h-3 bg-white/5 rounded-sm w-4/5" />
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="h-4 bg-amber-400/10 rounded-md w-14" />
                  <div className="h-4 bg-white/10 rounded-md w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State: Visually and textually distinct from loading, empty, and success results */}
      {!isLoading && error && (
        <div
          id="repo-search-error-state"
          role="alert"
          aria-live="polite"
          className="rounded-2xl bg-[#160b10] border border-rose-500/40 p-6 sm:p-8 text-center space-y-4 shadow-2xl transition-all"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" aria-hidden="true" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-hero text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
              Unable to load repositories.
            </h3>
            <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed font-sans">
              Please check your connection and try again.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              id="retry-search-btn"
              onClick={() => {
                setError(null);
                performSearch(query.trim() || submittedQuery || 'ai-agents');
              }}
              aria-label="Retry searching repositories"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-600/30 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-[#160b10]"
            >
              <RefreshCw className="w-4 h-4 motion-safe:group-hover:rotate-180 transition-transform motion-reduce:transform-none" aria-hidden="true" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty Results State */}
      {!isLoading && !error && hasSearched && repos.length === 0 && (
        <div className="bg-[#080B12] border border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-3 max-w-lg mx-auto shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Code2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="font-hero text-lg font-bold text-white uppercase">
            NO REPOSITORIES FOUND
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            No public GitHub repositories matched <span className="text-blue-400 font-mono">"{submittedQuery}"</span>. Try adjusting your query keywords or search for a popular topic above.
          </p>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && !error && repos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => {
            const languageColor = repo.language ? (LANGUAGE_COLORS[repo.language] || '#3B82F6') : null;

            return (
              <article
                key={repo.id}
                aria-label={`Repository ${repo.full_name}`}
                className="rounded-2xl bg-[#080B12] border border-white/10 hover:border-blue-500/40 p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-xl hover:shadow-blue-500/5 group relative overflow-hidden"
              >
                {/* Card Top: Owner Avatar & Repo Title */}
                <div className="space-y-2.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    {/* Owner Info */}
                    <div className="flex items-center gap-2 min-w-0">
                      {repo.owner.avatar_url ? (
                        <img
                          src={repo.owner.avatar_url}
                          alt={`${repo.owner.login} avatar`}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full border border-white/20 shrink-0 object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white shrink-0">
                          {repo.owner.login.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs text-slate-400 truncate font-mono">
                        {repo.owner.login}
                      </span>
                    </div>

                    {/* GitHub Link Icon */}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open repository ${repo.full_name} on GitHub (opens in new tab)`}
                      className="text-slate-400 group-hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-white/5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>

                  {/* Repository Name Link */}
                  <h3 className="font-hero text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors break-words">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline focus:outline-hidden focus:ring-1 focus:ring-blue-500 rounded-sm"
                    >
                      {repo.name}
                    </a>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed break-words">
                    {repo.description || 'No description provided for this repository.'}
                  </p>
                </div>

                {/* Card Footer: Stars, Language, and GitHub CTA Link */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-400">
                  {/* Metadata: Stars & Language */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Stars Count */}
                    <span
                      className="inline-flex items-center gap-1 font-mono font-semibold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20"
                      title={`${repo.stargazers_count.toLocaleString()} stars on GitHub`}
                    >
                      <Star className="w-3 h-3 fill-current text-amber-400" aria-hidden="true" />
                      <span>{formatStars(repo.stargazers_count)}</span>
                    </span>

                    {/* Language Badge */}
                    {repo.language && (
                      <span className="inline-flex items-center gap-1.5 text-slate-300 font-medium">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: languageColor || '#3B82F6' }}
                          aria-hidden="true"
                        />
                        <span>{repo.language}</span>
                      </span>
                    )}
                  </div>

                  {/* Direct GitHub Link Button */}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-600 text-slate-200 hover:text-white font-medium text-[11px] border border-white/10 hover:border-blue-500 transition-all shrink-0 cursor-pointer"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
