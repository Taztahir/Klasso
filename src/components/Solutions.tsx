import { Section } from './Section';

export const Solutions = () => {
    return (
        <section className="py-40">
            <Section className="max-w-4xl mx-auto px-6 text-center mb-24">
                <span className="text-brandPink font-bold uppercase tracking-widest text-xs">#Teamwork</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Explore our solutions</h2>
                <p className="text-base md:text-lg text-brandBlack/60">
                    With Zoomsphere, teamwork isn't just a concept. It's the key to a
                    happier team, high-quality content, outstanding results, satisfied clients, and a thriving business.
                </p>
            </Section>

            <div className="max-w-7xl mx-auto px-6 space-y-8">
                {/* Workflow Card */}
                <Section className="bg-brandPink/10 rounded-[40px] p-8 md:p-16 border-2 border-brandPink/20 flex flex-col md:flex-row gap-12">
                    <div className="flex-1">
                        <div className="w-12 h-12 bg-brandPink rounded-xl mb-8 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-6">Workflow Manager</h3>
                        <p className="text-sm md:text-base text-brandBlack/60 mb-8 max-w-md">
                            Coordinate and delegate tasks in your team or departments. Workflow Manager is suitable for any projects - content, blog, email, roadmap, bugs end etc.
                        </p>
                        <button className="bg-brandBlack text-white px-8 py-3 rounded-full font-bold">Learn more</button>
                    </div>
                    <div className="flex-1 bg-white rounded-3xl border-2 border-brandBlack overflow-hidden shadow-2xl skew-y-1 p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brandPink/20 border border-brandPink"></div>
                            <div className="h-2 bg-slate-100 rounded w-1/3"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-300 uppercase">Task Card</span>
                            </div>
                            <div className="h-12 bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-brandPurple"></div>
                                    <div className="h-2 bg-slate-100 rounded w-20"></div>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-slate-100"></div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Chat Card */}
                <Section className="bg-brandYellow/10 rounded-[40px] p-8 md:p-16 border-2 border-brandYellow/20 flex flex-col md:flex-row-reverse gap-12">
                    <div className="flex-1">
                        <div className="w-12 h-12 bg-brandYellow rounded-xl mb-8 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-brandBlack" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M19 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-6">Chat</h3>
                        <p className="text-sm md:text-base text-brandBlack/60 mb-8 max-w-md">
                            Having your own team chat brings up the fastest and most effective approval flow to your team collaboration. Finally, the perfect place to discuss.
                        </p>
                        <button className="bg-brandBlack text-white px-8 py-3 rounded-full font-bold">Learn more</button>
                    </div>
                    <div className="flex-1 bg-white rounded-3xl border-2 border-brandBlack overflow-hidden shadow-2xl -skew-y-1 p-8">
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-brandYellow/30 border border-brandYellow flex-shrink-0"></div>
                                <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 max-w-[80%]">
                                    <div className="h-2 bg-slate-200 rounded w-24 mb-2"></div>
                                    <div className="h-2 bg-slate-100 rounded w-full"></div>
                                </div>
                            </div>
                            <div className="flex items-start justify-end gap-3">
                                <div className="bg-brandBlack p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                                    <div className="h-2 bg-white/20 rounded w-24 mb-2"></div>
                                    <div className="h-2 bg-white/10 rounded w-full"></div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-brandPurple/30 border border-brandPurple flex-shrink-0"></div>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </section>
    );
};
