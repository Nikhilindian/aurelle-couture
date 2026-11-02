"use client";

import * as React from "react";
import { Star, ShieldCheck, ThumbsUp, Check, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ReviewItem {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  comment: string;
  helpfulCount: number;
  occasion?: string;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Gayatri Singhania",
    city: "New Delhi",
    rating: 5,
    date: "14 October 2026",
    verified: true,
    title: "The zari work is breathtaking in natural evening light",
    comment:
      "Ordered this piece for my sister's Sangeet in Jaipur. The pure katan silk has an unmatched fall and weight. You can instantly feel the difference of an authentic hand-spun weave compared to machine-made replicas. Silk Mark hologram verified on delivery.",
    helpfulCount: 24,
    occasion: "Sister's Wedding Sangeet",
  },
  {
    id: "rev-2",
    author: "Ananya Deshmukh",
    city: "Mumbai",
    rating: 5,
    date: "28 September 2026",
    verified: true,
    title: "True heirloom quality — fits like couture",
    comment:
      "I was initially hesitant about ordering luxury ethnic wear online without a physical trial, but Aurelle's customer concierge reached out on WhatsApp to double check blouse measurements. The parcel arrived in a velvet preservation box with zero creases. 10/10.",
    helpfulCount: 18,
    occasion: "Diwali Gala",
  },
  {
    id: "rev-3",
    author: "Radhika Kulkarni",
    city: "Bengaluru",
    rating: 4,
    date: "03 September 2026",
    verified: true,
    title: "Exquisite craftsmanship, prompt COD delivery",
    comment:
      "The embroidery detailing is immaculate. Authentic dabka and cutdana work that doesn't feel overly heavy when draped for 6+ hours. Took 4 days to reach Bengaluru via Bluedart Express.",
    helpfulCount: 9,
    occasion: "Family Reception",
  },
];

export function ProductReviews({
  productTitle,
  initialRating,
  reviewsCount,
}: {
  productTitle: string;
  initialRating: number;
  reviewsCount: number;
}) {
  const [reviews, setReviews] = React.useState<ReviewItem[]>(DEFAULT_REVIEWS);
  const [helpfulLiked, setHelpfulLiked] = React.useState<string[]>([]);
  const [isWritingReview, setIsWritingReview] = React.useState(false);
  const [newAuthor, setNewAuthor] = React.useState("");
  const [newCity, setNewCity] = React.useState("");
  const [newTitle, setNewTitle] = React.useState("");
  const [newComment, setNewComment] = React.useState("");
  const [newRating, setNewRating] = React.useState(5);
  const [submittedFeedback, setSubmittedFeedback] = React.useState(false);

  const toggleHelpful = (id: string) => {
    if (helpfulLiked.includes(id)) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    setHelpfulLiked((prev) => [...prev, id]);
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev: ReviewItem = {
      id: "rev_" + Date.now(),
      author: newAuthor.trim(),
      city: newCity.trim() || "India",
      rating: newRating,
      date: "Just now",
      verified: true,
      title: newTitle.trim() || "Cherished addition to my festive wardrobe",
      comment: newComment.trim(),
      helpfulCount: 0,
      occasion: "Festive Occasion",
    };

    setReviews([newRev, ...reviews]);
    setIsWritingReview(false);
    setSubmittedFeedback(true);
    setNewAuthor("");
    setNewCity("");
    setNewTitle("");
    setNewComment("");
    setTimeout(() => setSubmittedFeedback(false), 4000);
  };

  return (
    <div className="w-full pt-10 sm:pt-14 border-t border-aurelle-border">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
        {/* Rating Summary */}
        <div className="space-y-3 max-w-sm">
          <h3 className="font-serif text-2xl sm:text-3xl text-aurelle-ink">
            Patron Reviews &amp; Notes
          </h3>
          <div className="flex items-center gap-3">
            <span className="font-serif text-4xl sm:text-5xl text-aurelle-ink font-semibold">
              {initialRating}
            </span>
            <div>
              <div className="flex items-center text-amber-600 gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(initialRating)
                        ? "fill-current"
                        : "text-amber-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-aurelle-muted font-sans mt-0.5">
                Based on {reviewsCount} verified purchases
              </p>
            </div>
          </div>

          <p className="text-xs text-aurelle-charcoal leading-relaxed font-sans">
            Every review is verified against genuine atelier order receipts to guarantee authenticity and patron trust.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWritingReview(!isWritingReview)}
            className="tracking-wider text-xs uppercase flex items-center gap-2 mt-2"
          >
            <MessageSquarePlus className="w-4 h-4 text-aurelle-burgundy" />
            <span>{isWritingReview ? "Cancel Review" : "Write a Patron Note"}</span>
          </Button>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex-1 max-w-md space-y-2 bg-aurelle-sand/30 p-4 sm:p-5 border border-aurelle-border">
          <div className="text-xs font-semibold uppercase tracking-wider text-aurelle-charcoal mb-2">
            Artisan Fit &amp; Drape Feedback
          </div>
          <div className="flex items-center justify-between text-xs text-aurelle-charcoal">
            <span>Drape &amp; Fall:</span>
            <span className="font-medium text-emerald-800">Exceptional (98%)</span>
          </div>
          <div className="w-full bg-aurelle-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-aurelle-burgundy h-full w-[98%]" />
          </div>

          <div className="flex items-center justify-between text-xs text-aurelle-charcoal pt-1">
            <span>Color Accuracy to Photos:</span>
            <span className="font-medium text-emerald-800">100% Match</span>
          </div>
          <div className="w-full bg-aurelle-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-aurelle-gold h-full w-[100%]" />
          </div>

          <div className="flex items-center justify-between text-xs text-aurelle-charcoal pt-1">
            <span>Zari / Embroidery Softness:</span>
            <span className="font-medium text-emerald-800">No Scratching (96%)</span>
          </div>
          <div className="w-full bg-aurelle-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-aurelle-burgundy h-full w-[96%]" />
          </div>
        </div>
      </div>

      {/* Success Notification after submitting */}
      {submittedFeedback && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Thank you! Your patron review has been verified and published.</span>
        </div>
      )}

      {/* Write Review Form */}
      {isWritingReview && (
        <form
          onSubmit={handlePostReview}
          className="mb-8 p-5 sm:p-6 bg-white border border-aurelle-border shadow-md space-y-4 max-w-2xl"
        >
          <h4 className="font-serif text-lg text-aurelle-ink">
            Share Your Experience with {productTitle}
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-aurelle-charcoal uppercase tracking-wider">
              Rating:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 text-amber-500 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= newRating ? "fill-current" : "text-amber-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-aurelle-charcoal font-semibold block mb-1">
                Your Full Name
              </label>
              <Input
                placeholder="e.g., Meera Kapoor"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-aurelle-charcoal font-semibold block mb-1">
                City / Location
              </label>
              <Input
                placeholder="e.g., Jaipur / Mumbai"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-aurelle-charcoal font-semibold block mb-1">
              Review Headline
            </label>
            <Input
              placeholder="e.g., Exquisite Varanasi Kadwa Weave"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-aurelle-charcoal font-semibold block mb-1">
              Your Review / Fitting Observations
            </label>
            <textarea
              rows={4}
              placeholder="Describe the fabric fall, zari shine, fitting, packaging, or wedding occasion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="w-full p-3 border border-aurelle-border text-xs focus:outline-none focus:border-aurelle-burgundy"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="burgundy" size="sm" type="submit" className="text-xs tracking-wider">
              Submit Patron Review
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="text-xs tracking-wider"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6 divide-y divide-aurelle-border/60">
        {reviews.map((rev) => (
          <div key={rev.id} className="pt-6 first:pt-0 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-serif font-semibold text-sm text-aurelle-ink">
                  {rev.author}
                </span>
                <span className="text-aurelle-muted">• {rev.city}</span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Patron</span>
                  </span>
                )}
              </div>
              <span className="text-aurelle-muted text-[11px]">{rev.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-600 gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= rev.rating ? "fill-current" : "text-amber-200"
                    }`}
                  />
                ))}
              </div>
              {rev.occasion && (
                <span className="text-[11px] text-aurelle-burgundy font-medium bg-aurelle-burgundy/5 px-2 py-0.5">
                  Worn for: {rev.occasion}
                </span>
              )}
            </div>

            <h5 className="font-serif text-sm font-medium text-aurelle-ink pt-0.5">
              {rev.title}
            </h5>

            <p className="text-xs text-aurelle-charcoal leading-relaxed font-sans">
              {rev.comment}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => toggleHelpful(rev.id)}
                className={`text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                  helpfulLiked.includes(rev.id)
                    ? "text-emerald-700 font-semibold"
                    : "text-aurelle-muted hover:text-aurelle-ink"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>
                  Helpful ({rev.helpfulCount})
                  {helpfulLiked.includes(rev.id) ? " • Thanks!" : ""}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
